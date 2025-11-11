<x-admin::layouts>
    <x-slot:title>
        @lang('admin::app.settings.workflows.create.title')
    </x-slot>

    {!! view_render_event('admin.settings.workflow.form.before') !!}

    <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <div class="flex flex-col gap-2">
                {!! view_render_event('admin.settings.workflow.breadcrumbs.before') !!}

                <x-admin::breadcrumbs name="settings.workflows.create" />

                {!! view_render_event('admin.settings.webhooks.breadcrumbs.after') !!}

                <div class="text-xl font-bold dark:text-white">
                    @lang('admin::app.settings.workflows.create.title')
                </div>
            </div>
        </div>

        <!-- Visual Workflow Builder Component -->
        <workflow-builder></workflow-builder>
    </div>

    {!! view_render_event('admin.settings.workflow.form.after') !!}
</x-admin::layouts>
