<?php

namespace Webkul\Admin\Http\Controllers\Settings;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Event;
use Illuminate\View\View;
use Webkul\Admin\DataGrids\Settings\WorkflowDataGrid;
use Webkul\Admin\Http\Controllers\Controller;
use Webkul\Automation\Repositories\WorkflowRepository;
use Webkul\Automation\Helpers\Entity as EntityHelper;

class WorkflowController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(
        protected WorkflowRepository $workflowRepository,
        protected EntityHelper $entityHelper
    ) {}

    /**
     * Display a listing of the workflow.
     */
    public function index(): View|JsonResponse
    {
        if (request()->expectsJson() || request()->ajax()) {
            return datagrid(WorkflowDataGrid::class)->process();
        }

        return view('admin::settings.workflows.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): View
    {
        return view('admin::settings.workflows.create');
    }

    /**
     * Store a newly created workflow in storage.
     */
    public function store(): RedirectResponse
    {
        $this->validate(request(), [
            'name' => 'required',
        ]);

        Event::dispatch('settings.workflow.create.before');

        $workflow = $this->workflowRepository->create(request()->all());

        Event::dispatch('settings.workflow.create.after', $workflow);

        session()->flash('success', trans('admin::app.settings.workflows.index.create-success'));

        return redirect()->route('admin.settings.workflows.index');
    }

    /**
     * Show the form for editing the specified workflow.
     */
    public function edit(int $id): View
    {
        $workflow = $this->workflowRepository->findOrFail($id);

        return view('admin::settings.workflows.edit', compact('workflow'));
    }

    /**
     * Update the specified workflow in storage.
     */
    public function update(int $id): RedirectResponse
    {
        $this->validate(request(), [
            'name' => 'required',
        ]);

        Event::dispatch('settings.workflow.update.before', $id);

        $workflow = $this->workflowRepository->update(request()->all(), $id);

        Event::dispatch('settings.workflow.update.after', $workflow);

        session()->flash('success', trans('admin::app.settings.workflows.index.update-success'));

        return redirect()->route('admin.settings.workflows.index');
    }

    /**
     * Remove the specified workflow from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $workflow = $this->workflowRepository->findOrFail($id);

        try {
            Event::dispatch('settings.workflow.delete.before', $id);

            $workflow->delete($id);

            Event::dispatch('settings.workflow.delete.after', $id);

            return response()->json([
                'message' => trans('admin::app.settings.workflows.index.delete-success'),
            ], 200);
        } catch (\Exception $exception) {
            return response()->json([
                'message' => trans('admin::app.settings.workflows.index.delete-failed'),
            ], 400);
        }

        return response()->json([
            'message' => trans('admin::app.settings.workflows.index.delete-failed'),
        ], 400);
    }

    /**
     * Save workflow JSON data.
     */
    public function saveJson(): JsonResponse
    {
        $data = request()->validate([
            'name'      => 'required|string|max:255',
            'flow_json' => 'required',
            'id'        => 'nullable|integer|exists:workflows,id',
        ]);

        try {
            if (!empty($data['id'])) {
                // Update existing workflow
                $workflow = $this->workflowRepository->update([
                    'flow_json' => $data['flow_json'],
                    'name'      => $data['name'],
                ], $data['id']);

                return response()->json([
                    'success'     => true,
                    'workflow_id' => $workflow->id,
                    'message'     => 'Workflow updated successfully',
                ]);
            } else {
                // Create new workflow
                $workflow = $this->workflowRepository->create([
                    'name'           => $data['name'],
                    'flow_json'      => $data['flow_json'],
                    'entity_type'    => 'leads', // Default entity type
                    'event'          => 'lead.create', // Default event
                    'condition_type' => 'and',
                ]);

                return response()->json([
                    'success'     => true,
                    'workflow_id' => $workflow->id,
                    'message'     => 'Workflow created successfully',
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save workflow: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Load workflow JSON data.
     */
    public function loadJson(int $id): JsonResponse
    {
        try {
            $workflow = $this->workflowRepository->findOrFail($id);

            return response()->json([
                'success'   => true,
                'id'        => $workflow->id,
                'name'      => $workflow->name,
                'flow_json' => $workflow->flow_json,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Workflow not found',
            ], 404);
        }
    }

    /**
     * Get workflow configuration options (events, conditions, actions).
     */
    public function getOptions(): JsonResponse
    {
        try {
            $events = $this->entityHelper->getEvents();
            $conditions = $this->entityHelper->getConditions();
            $actions = $this->entityHelper->getActions();

            return response()->json([
                'success'    => true,
                'events'     => $events,
                'conditions' => $conditions,
                'actions'    => $actions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load options: ' . $e->getMessage(),
            ], 500);
        }
    }
}
