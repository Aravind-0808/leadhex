<x-admin::layouts>
    <x-slot:title>
        @lang('admin::app.settings.workflows.create.title')
    </x-slot>

    <x-admin::form :action="route('admin.settings.workflows.store')">
        <div class="flex flex-col gap-4">
            <!-- Header -->
            <div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                <div class="flex flex-col gap-2">
                    <x-admin::breadcrumbs name="settings.workflows.create" />
                    
                    <div class="text-xl font-bold dark:text-white">
                        @lang('admin::app.settings.workflows.create.title')
                    </div>
                </div>

                <div class="flex items-center gap-x-2.5">
                    <button type="submit" class="primary-button">
                        @lang('admin::app.settings.workflows.create.save-btn')
                    </button>
                </div>
            </div>

            <!-- Basic Info Fields (Above Canvas) -->
            <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 class="text-lg font-semibold mb-4 dark:text-white">Basic Details</h3>
                
                <div class="grid grid-cols-2 gap-4">
                    <x-admin::form.control-group>
                        <x-admin::form.control-group.label class="required">
                            @lang('admin::app.settings.workflows.create.name')
                        </x-admin::form.control-group.label>

                        <x-admin::form.control-group.control
                            type="text"
                            name="name"
                            id="name"
                            rules="required"
                            :label="trans('admin::app.settings.workflows.create.name')"
                            :placeholder="trans('admin::app.settings.workflows.create.name')"
                        />

                        <x-admin::form.control-group.error control-name="name" />
                    </x-admin::form.control-group>

                    <x-admin::form.control-group>
                        <x-admin::form.control-group.label>
                            @lang('admin::app.settings.workflows.create.description')
                        </x-admin::form.control-group.label>

                        <x-admin::form.control-group.control
                            type="textarea"
                            name="description"
                            id="description"
                            rows="3"
                            :label="trans('admin::app.settings.workflows.create.description')"
                            :placeholder="trans('admin::app.settings.workflows.create.description')"
                        />

                        <x-admin::form.control-group.error control-name="description" />
                    </x-admin::form.control-group>
                </div>
            </div>

            <!-- Visual Workflow Canvas -->
            <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" style="height: 600px;">
                <workflow-canvas 
                    :workflow-data="{}"
                    entity-type="leads"
                    @save="handleWorkflowSave"
                ></workflow-canvas>
            </div>
        </div>
    </x-admin::form>

    @pushOnce('scripts')
        <script type="module">
            // Handle workflow save event
            window.handleWorkflowSave = function(workflowData) {
                console.log('Workflow saved:', workflowData);
            };
        </script>
    @endPushOnce
</x-admin::layouts>
