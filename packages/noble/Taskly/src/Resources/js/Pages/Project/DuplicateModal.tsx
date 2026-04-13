import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckSquare, Bug, Target, FileText, Users, MessageSquare, Activity, UserCheck, Milestone } from 'lucide-react';

interface ProjectItem {
    id: number;
    name: string;
}

interface DuplicateModalProps {
    isOpen: boolean;
    project: ProjectItem | null;
    onClose: () => void;
}

export default function DuplicateModal({ isOpen, project, onClose }: DuplicateModalProps) {
    const { t } = useTranslation();
    const [options, setOptions] = useState({
        all: false,
        tasks: true,
        taskSubtasks: true,
        taskComments: true,
        bugs: true,
        bugComments: true,
        activity: false,
        teamMembers: true,
        clients: true,
        milestones: true,
        projectFiles: false,
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = () => {
        if (!project) return;

        setProcessing(true);
        router.post(route('project.duplicate', project.id), options, {
            onSuccess: () => {
                onClose();
                setOptions({
                    all: false,
                    tasks: true,
                    taskSubtasks: false,
                    taskComments: false,
                    bugs: true,
                    bugComments: true,
                    activity: false,
                    teamMembers: true,
                    clients: true,
                    milestones: true,
                    projectFiles: false,
                });
            },
            onFinish: () => setProcessing(false),
        });
    };

    if (!project) return null;

    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>
                    {t('Duplicate Project')}: {project.name}
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                <div className="mt-3 space-y-3">
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="all"
                            checked={options.all}
                            onCheckedChange={(checked) => {
                                const isChecked = !!checked;
                                setOptions({
                                    all: isChecked,
                                    tasks: isChecked,
                                    taskSubtasks: isChecked,
                                    taskComments: isChecked,
                                    bugs: isChecked,
                                    bugComments: isChecked,
                                    activity: isChecked,
                                    teamMembers: isChecked,
                                    clients: isChecked,
                                    milestones: isChecked,
                                    projectFiles: isChecked,
                                });
                            }}
                        />
                        <Label htmlFor="all" className="flex cursor-pointer items-center gap-2 font-semibold">
                            <CheckSquare className="h-4 w-4 text-foreground" />
                            {t('All')}
                        </Label>
                    </div>

                    {/* Tasks Parent */}
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="tasks"
                            checked={options.tasks}
                            onCheckedChange={(checked) => setOptions({ ...options, tasks: !!checked })}
                        />
                        <Label htmlFor="tasks" className="flex cursor-pointer items-center gap-2 font-medium">
                            <CheckSquare className="h-4 w-4 text-foreground" />
                            {t('Tasks')}
                        </Label>
                    </div>

                    {/* Tasks Children */}
                    <div className="ml-8 space-y-2">
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="taskSubtasks"
                                checked={options.taskSubtasks}
                                onCheckedChange={(checked) => setOptions({ ...options, taskSubtasks: !!checked })}
                            />
                            <Label htmlFor="taskSubtasks" className="flex cursor-pointer items-center gap-2 text-sm">
                                <CheckSquare className="h-3 w-3 text-foreground" />
                                {t('Task Subtasks')}
                            </Label>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="taskComments"
                                checked={options.taskComments}
                                onCheckedChange={(checked) => setOptions({ ...options, taskComments: !!checked })}
                            />
                            <Label htmlFor="taskComments" className="flex cursor-pointer items-center gap-2 text-sm">
                                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                {t('Task Comments')}
                            </Label>
                        </div>
                    </div>

                    {/* Bugs Parent */}
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="bugs"
                            checked={options.bugs}
                            onCheckedChange={(checked) => setOptions({ ...options, bugs: !!checked })}
                        />
                        <Label htmlFor="bugs" className="flex cursor-pointer items-center gap-2 font-medium">
                            <Bug className="h-4 w-4 text-destructive" />
                            {t('Bugs')}
                        </Label>
                    </div>

                    {/* Bugs Children */}
                    <div className="ml-8">
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="bugComments"
                                checked={options.bugComments}
                                onCheckedChange={(checked) => setOptions({ ...options, bugComments: !!checked })}
                            />
                            <Label htmlFor="bugComments" className="flex cursor-pointer items-center gap-2 text-sm">
                                <MessageSquare className="h-3 w-3 text-destructive" />
                                {t('Bug Comments')}
                            </Label>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="activity"
                            checked={options.activity}
                            onCheckedChange={(checked) => setOptions({ ...options, activity: !!checked })}
                        />
                        <Label htmlFor="activity" className="flex cursor-pointer items-center gap-2">
                            <Activity className="h-4 w-4 text-foreground" />
                            {t('Activity')}
                        </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="teamMembers"
                            checked={options.teamMembers}
                            onCheckedChange={(checked) => setOptions({ ...options, teamMembers: !!checked })}
                        />
                        <Label htmlFor="teamMembers" className="flex cursor-pointer items-center gap-2">
                            <Users className="h-4 w-4 text-foreground" />
                            {t('Team Members')}
                        </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="clients"
                            checked={options.clients}
                            onCheckedChange={(checked) => setOptions({ ...options, clients: !!checked })}
                        />
                        <Label htmlFor="clients" className="flex cursor-pointer items-center gap-2">
                            <UserCheck className="h-4 w-4 text-foreground" />
                            {t('Clients')}
                        </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="milestones"
                            checked={options.milestones}
                            onCheckedChange={(checked) => setOptions({ ...options, milestones: !!checked })}
                        />
                        <Label htmlFor="milestones" className="flex cursor-pointer items-center gap-2">
                            <Milestone className="h-4 w-4 text-foreground" />
                            {t('Milestones')}
                        </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="projectFiles"
                            checked={options.projectFiles}
                            onCheckedChange={(checked) => setOptions({ ...options, projectFiles: !!checked })}
                        />
                        <Label htmlFor="projectFiles" className="flex cursor-pointer items-center gap-2">
                            <FileText className="h-4 w-4 text-foreground" />
                            {t('Project Files')}
                        </Label>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={processing}>
                        {processing ? t('Duplicating...') : t('Duplicate')}
                    </Button>
                </div>
            </div>
        </DialogContent>
    );
}
