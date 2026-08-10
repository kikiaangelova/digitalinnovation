/**
 * AssignmentsTab — Teacher MVP Sprint 1.
 *
 * Everything here is scoped to the classroom passed in as a prop; the
 * component never queries "all classrooms". Assignment integrity rules
 * live in `@/lib/teacher-assignments` so they stay testable.
 */

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, ClipboardList, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import type { ClassroomStudent } from '@/hooks/useClassroomStudents';
import type { ClassroomAssignment } from '@/hooks/useClassroomAssignments';
import type { CatalogModule } from '@/hooks/useModuleCatalog';
import { useModuleResponses } from '@/hooks/useModuleResponses';
import TeacherRubricPanel from '@/components/teacher-workspace/TeacherRubricPanel';
import type { TeacherPack } from '@/data/module-pilot-types';
import {
  FEEDBACK_TARGET_TYPE,
  STATUS_LABELS,
  countCompleted,
  deriveAssignmentStatus,
  dedupeModulesByIdentity,
  filterAssignableModules,
  indexResponses,
  responseKey,
  validateAssignmentDraft,
  type AssignmentStatus,
} from '@/lib/teacher-assignments';

interface Props {
  classroomId: string;
  subjectKey: string;
  students: ClassroomStudent[];
  assignments: ClassroomAssignment[];
  catalog: CatalogModule[];
  catalogLoading: boolean;
  onAssignmentsChanged: () => void;
}

const STATUS_VARIANT: Record<AssignmentStatus, 'secondary' | 'outline' | 'default'> = {
  not_started: 'outline',
  in_progress: 'secondary',
  completed: 'default',
};

export default function AssignmentsTab({
  classroomId,
  subjectKey,
  students,
  assignments,
  catalog,
  catalogLoading,
  onAssignmentsChanged,
}: Props) {
  const { lang } = useLang();
  const { user } = useAuth();
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);

  const [moduleSlug, setModuleSlug] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [openDetail, setOpenDetail] = useState<{ studentId: string; slug: string } | null>(null);

  const assignable = useMemo(
    () => filterAssignableModules(catalog, subjectKey),
    [catalog, subjectKey],
  );
  const assignableSlugs = useMemo(() => assignable.map((m) => m.slug), [assignable]);

  const moduleAssignments = useMemo(
    () => assignments.filter((a) => a.assignment_type === 'module' && a.module_slug),
    [assignments],
  );

  const assignedModules = useMemo(
    () =>
      dedupeModulesByIdentity(
        moduleAssignments
          .map((a) => catalog.find((c) => c.slug === a.module_slug))
          .filter((m): m is CatalogModule => !!m && !!m.dbId),
      ),
    [moduleAssignments, catalog],
  );

  const studentIds = useMemo(() => students.map((s) => s.student_id), [students]);
  const moduleIds = useMemo(
    () => assignedModules.map((m) => m.dbId as string),
    [assignedModules],
  );
  const { responses, loading: responsesLoading, refresh: refreshResponses } =
    useModuleResponses(studentIds, moduleIds);
  const responseIndex = useMemo(() => indexResponses(responses), [responses]);

  const validation = validateAssignmentDraft(
    { assignmentType: 'module', moduleSlug },
    assignableSlugs,
  );

  const handleAssign = async () => {
    if (!validation.valid || !user) return;
    setSubmitting(true);
    const { error } = await supabase.from('classroom_assignments').insert({
      classroom_id: classroomId,
      assigned_by: user.id,
      assignment_type: 'module',
      module_slug: moduleSlug,
      note: note.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(t('Could not create the assignment.', 'Задачата не беше създадена.'));
      return;
    }
    toast.success(t('Assignment created.', 'Задачата е създадена.'));
    setModuleSlug(null);
    setNote('');
    onAssignmentsChanged();
  };

  return (
    <div className="space-y-4">
      {/* ---- Create assignment ---- */}
      <Card className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">
            {t('Assign a module', 'Задай модул')}
          </h2>
        </div>

        {catalogLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('Loading modules…', 'Зареждане на модулите…')}
          </div>
        ) : assignable.length === 0 ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t(
                'No playable module is available for this classroom subject yet. A module must be registered and have full content before it can be assigned.',
                'Още няма играем модул за предмета на този клас. Модулът трябва да е регистриран и с пълно съдържание, за да бъде зададен.',
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="module-select">{t('Module', 'Модул')}</Label>
              <Select value={moduleSlug ?? undefined} onValueChange={setModuleSlug}>
                <SelectTrigger id="module-select" className="min-h-[44px]">
                  <SelectValue placeholder={t('Choose a module', 'Избери модул')} />
                </SelectTrigger>
                <SelectContent>
                  {assignable.map((m) => (
                    <SelectItem key={m.slug} value={m.slug}>
                      {lang === 'bg' ? m.title_bg : m.title_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignment-note">
                {t('Note for students (optional)', 'Бележка за учениците (по избор)')}
              </Label>
              <Textarea
                id="assignment-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
              />
            </div>

            {!validation.valid && (
              <p role="alert" className="text-sm text-destructive">
                {lang === 'bg' ? validation.errorBg : validation.errorEn}
              </p>
            )}

            <Button
              className="min-h-[44px]"
              disabled={!validation.valid || submitting}
              onClick={handleAssign}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-1" />
              )}
              {t('Assign to this classroom', 'Задай на този клас')}
            </Button>
          </>
        )}
      </Card>

      {/* ---- Progress per assignment ---- */}
      {assignedModules.length === 0 ? (
        <Card className="p-6 text-sm text-muted-foreground text-center">
          {t('No module assigned to this classroom yet.', 'Още няма зададен модул за този клас.')}
        </Card>
      ) : (
        assignedModules.map((m) => {
          const statuses = students.map((s) =>
            deriveAssignmentStatus(responseIndex.get(responseKey(s.student_id, m.dbId as string))),
          );
          return (
            <Card key={m.slug} className="p-4 sm:p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">{lang === 'bg' ? m.title_bg : m.title_en}</h3>
                <Badge variant="secondary">
                  {countCompleted(statuses)}/{students.length} {t('completed', 'завършили')}
                </Badge>
              </div>
              {responsesLoading && (
                <p className="text-xs text-muted-foreground">{t('Loading evidence…', 'Зареждане на доказателства…')}</p>
              )}
              <ul className="divide-y">
                {students.map((s) => {
                  const resp = responseIndex.get(responseKey(s.student_id, m.dbId as string));
                  const status = deriveAssignmentStatus(resp);
                  const isOpen =
                    openDetail?.studentId === s.student_id && openDetail?.slug === m.slug;
                  return (
                    <li key={s.student_id} className="py-2 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm">
                          {s.display_name || s.full_name || t('Student', 'Ученик')}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant={STATUS_VARIANT[status]}>
                            {lang === 'bg' ? STATUS_LABELS[status].bg : STATUS_LABELS[status].en}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-h-[44px]"
                            onClick={() =>
                              setOpenDetail(isOpen ? null : { studentId: s.student_id, slug: m.slug })
                            }
                          >
                            {isOpen ? t('Hide', 'Скрий') : t('View work', 'Виж работата')}
                          </Button>
                        </div>
                      </div>
                      {isOpen && (
                        <EvidenceDetail
                          response={resp ?? null}
                          studentId={s.student_id}
                          teacherPack={m.staticModule?.teacher_pack ?? null}
                          onSaved={refreshResponses}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function EvidenceDetail({
  response,
  studentId,
  teacherPack,
  onSaved,
}: {
  response: {
    id: string;
    quiz_score?: number | null;
    quiz_max?: number | null;
    analytical_answer?: string | null;
    application_answer?: string | null;
  } | null;
  studentId: string;
  /** Teacher-only guidance for pilot modules. Null for other modules. */
  teacherPack?: TeacherPack | null;
  onSaved: () => void;
}) {
  const { lang } = useLang();
  const { user } = useAuth();
  const t = (en: string, bg: string) => (lang === 'bg' ? bg : en);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const responseId = response?.id ?? null;
  const teacherId = user?.id ?? null;

  useEffect(() => {
    let cancelled = false;
    if (!teacherId || !responseId) return;
    setLoadingFeedback(true);
    setLoadError(null);
    void (async () => {
      const { data, error } = await supabase
        .from('teacher_feedback')
        .select('id, comment')
        .eq('teacher_id', teacherId)
        .eq('student_id', studentId)
        .eq('target_type', FEEDBACK_TARGET_TYPE)
        .eq('target_id', responseId)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setLoadError(error.message ?? 'load failed');
      } else if (data) {
        setFeedbackId(data.id);
        setComment(data.comment ?? '');
      } else {
        setFeedbackId(null);
      }
      setLoadingFeedback(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [teacherId, studentId, responseId]);

  if (!response) {
    return (
      <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
        {t(
          'This student has not started the module, so there is no work to review and no feedback can be left yet.',
          'Ученикът още не е започнал модула — няма работа за преглед и още не може да се остави обратна връзка.',
        )}
      </div>
    );
  }

  const saveFeedback = async () => {
    // A failed load means we cannot know whether a row already exists,
    // so inserting would risk a duplicate — saving stays blocked.
    if (!user || loadError || comment.trim().length === 0) return;
    setSaving(true);
    if (feedbackId) {
      const { error } = await supabase
        .from('teacher_feedback')
        .update({ comment: comment.trim() })
        .eq('id', feedbackId);
      setSaving(false);
      if (error) {
        toast.error(t('Feedback was not saved.', 'Обратната връзка не беше запазена.'));
        return;
      }
    } else {
      const { data, error } = await supabase
        .from('teacher_feedback')
        .insert({
          teacher_id: user.id,
          student_id: studentId,
          target_type: FEEDBACK_TARGET_TYPE,
          target_id: response.id,
          comment: comment.trim(),
        })
        .select('id')
        .single();
      setSaving(false);
      if (error || !data) {
        toast.error(t('Feedback was not saved.', 'Обратната връзка не беше запазена.'));
        return;
      }
      // Remember the new row so a second save in the same panel updates
      // it instead of inserting a duplicate.
      setFeedbackId(data.id);
    }
    toast.success(t('Feedback saved.', 'Обратната връзка е запазена.'));
    onSaved();
  };

  return (
    <div className="rounded-md border bg-muted/30 p-3 space-y-3 text-sm">
      <p>
        <span className="font-medium">{t('Quiz result', 'Резултат от теста')}: </span>
        {response.quiz_score ?? 0}/{response.quiz_max ?? 0}
      </p>
      <div>
        <p className="font-medium">{t('Analytical answer', 'Аналитичен отговор')}</p>
        <p className="whitespace-pre-line text-muted-foreground">
          {response.analytical_answer?.trim() || t('No answer yet.', 'Още няма отговор.')}
        </p>
      </div>
      <div>
        <p className="font-medium">{t('Application answer', 'Приложен отговор')}</p>
        <p className="whitespace-pre-line text-muted-foreground">
          {response.application_answer?.trim() || t('No answer yet.', 'Още няма отговор.')}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`fb-${response.id}`}>{t('Your feedback', 'Твоята обратна връзка')}</Label>
        <div className={teacherPack ? 'grid gap-3 lg:grid-cols-2' : undefined}>
          <div className="space-y-2">
            {loadingFeedback && (
              <p className="text-xs text-muted-foreground">
                {t('Loading your feedback…', 'Зареждане на обратната ти връзка…')}
              </p>
            )}
            {loadError && (
              <p role="alert" className="text-xs text-destructive">
                {t('Existing feedback could not be loaded.', 'Съществуващата обратна връзка не можа да се зареди.')}
              </p>
            )}
            <Textarea
              id={`fb-${response.id}`}
              rows={3}
              value={comment}
              disabled={loadingFeedback}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              size="sm"
              className="min-h-[44px]"
              disabled={saving || loadingFeedback || !!loadError || comment.trim().length === 0}
              onClick={saveFeedback}
            >
              {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
              {t('Save feedback', 'Запази обратната връзка')}
            </Button>
          </div>
          {teacherPack && <TeacherRubricPanel pack={teacherPack} />}
        </div>
      </div>
    </div>
  );
}
