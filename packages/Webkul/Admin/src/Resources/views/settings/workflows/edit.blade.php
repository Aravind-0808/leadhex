<x-admin::layouts>
    <x-slot:title>
        @lang('admin::app.settings.workflows.edit.title')
    </x-slot>

    {!! view_render_event('admin.settings.workflow.edit.before', ['workflow' => $workflow]) !!}

    <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <div class="flex flex-col gap-2">
                {!! view_render_event('admin.settings.workflows.edit.breadcrumbs.before', ['workflow' => $workflow]) !!}

                <x-admin::breadcrumbs
                    name="settings.workflows.edit"
                    :entity="$workflow"
                />

                {!! view_render_event('admin.settings.workflows.edit.breadcrumbs.after', ['workflow' => $workflow]) !!}

                <div class="text-xl font-bold dark:text-white">
                    @lang('admin::app.settings.workflows.edit.title')
                </div>
            </div>
        </div>

        <!-- Visual Workflow Builder Component -->
        <workflow-builder
            :workflow-id="{{ $workflow->id }}"
            workflow-name="{{ $workflow->name }}"
            :initial-data='@json($workflow->flow_json)'
        ></workflow-builder>
    </div>

    {!! view_render_event('admin.settings.workflow.edit.after', ['workflow' => $workflow]) !!}
</x-admin::layouts>
