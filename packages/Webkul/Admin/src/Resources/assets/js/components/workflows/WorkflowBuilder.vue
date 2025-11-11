<template>
    <div class="workflow-builder-container">
        <WorkflowToolbar
            :saved-workflows="savedWorkflows"
            :show-load-dropdown="showLoadDropdown"
            @new-workflow="newWorkflow"
            @toggle-load-dropdown="toggleLoadDropdown"
            @load-workflow="loadWorkflow"
            @import="triggerImport"
            @export="exportWorkflow"
            @preview="previewJSON"
            @save="saveWorkflow"
            @save-as="saveWorkflowAs"
        />

        <div class="workflow-content">
            <NodePalette
                :event-nodes="eventNodes"
                :condition-nodes="filteredConditionNodes"
                :action-nodes="actionNodes"
                @drag-start="handleDragStart"
            />

            <WorkflowCanvas
                ref="canvasComponent"
                :has-nodes="hasNodes"
                @drop="handleDrop"
                @drag-over="handleDragOver"
            />
        </div>

        <input 
            ref="fileInput" 
            type="file" 
            accept=".json"
            style="display: none;"
            @change="handleImport"
        />

        <PreviewModal
            v-if="showPreviewModal"
            :formatted-json="formattedJSON"
            @close="showPreviewModal = false"
            @copy="copyJSON"
            @download="downloadJSON"
        />

        <SaveAsModal
            v-if="showSaveAsModal"
            v-model:name="saveAsName"
            @close="showSaveAsModal = false"
            @save="confirmSaveAs"
        />
    </div>
</template>

<script>
import Drawflow from 'drawflow';
import 'drawflow/dist/drawflow.min.css';

import WorkflowToolbar from './components/WorkflowToolbar.vue';
import NodePalette from './components/NodePalette.vue';
import WorkflowCanvas from './components/WorkflowCanvas.vue';
import PreviewModal from './components/PreviewModal.vue';
import SaveAsModal from './components/SaveAsModal.vue';

import { nodeDefinitions } from './config/nodeDefinitions';
import { workflowMethods } from './mixins/workflowMethods';
import { nodeMethods } from './mixins/nodeMethods';
import { importExportMethods } from './mixins/importExportMethods';

export default {
    name: 'WorkflowBuilder',
    
    components: {
        WorkflowToolbar,
        NodePalette,
        WorkflowCanvas,
        PreviewModal,
        SaveAsModal
    },

    mixins: [workflowMethods, nodeMethods, importExportMethods],
    
    props: {
        initialData: {
            type: Object,
            default: null
        },
        workflowId: {
            type: Number,
            default: null
        },
        workflowName: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            // Editor Instance
            editor: null,
            selectedNode: null,
            canvasUpdateTrigger: 0,
            
            // UI State
            showPreviewModal: false,
            showSaveAsModal: false,
            showLoadDropdown: false,
            saveAsName: '',
            
            // Workflow Data
            savedWorkflows: [],
            currentWorkflowId: this.workflowId,
            currentWorkflowName: this.workflowName,
            workflowOptions: {
                events: [],
                conditions: [],
                actions: []
            },
            
            // Node Definitions (imported from config)
            ...nodeDefinitions
        };
    },

    computed: {
        formattedJSON() {
            const data = this.editor ? this.editor.export() : {};
            return JSON.stringify(data, null, 2);
        },
        
        hasNodes() {
            this.canvasUpdateTrigger;
            if (!this.editor) return false;
            const exportData = this.editor.export();
            const nodes = exportData.drawflow?.Home?.data || {};
            return Object.keys(nodes).length > 0;
        },
        
        canvasEventEntity() {
            this.canvasUpdateTrigger;
            if (!this.editor) return null;
            const exportData = this.editor.export();
            const nodes = exportData.drawflow?.Home?.data || {};
            const eventNode = Object.values(nodes).find(node => node.data?.nodeType === 'event');
            return eventNode?.data?.entity || null;
        },
        
        filteredConditionNodes() {
            if (!this.canvasEventEntity) {
                return this.conditionNodes;
            }
            return this.conditionNodes.filter(c => c.entity === this.canvasEventEntity);
        }
    },

    mounted() {
        this.initializeEditor();
        this.loadWorkflowOptions();
        this.loadSavedWorkflows();
        
        if (this.initialData) {
            this.importData(this.initialData);
        }

        document.addEventListener('click', this.handleClickOutside);
    },

    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },

    methods: {
        initializeEditor() {
            const container = this.$refs.canvasComponent.$refs.drawflowContainer;
            if (!container) return;
            
            this.editor = new Drawflow(container);
            this.editor.reroute = true;
            this.editor.start();

            this.editor.on('nodeSelected', (id) => {
                const nodeData = this.editor.getNodeFromId(id);
                if (nodeData) {
                    this.selectedNode = { id: id, data: { ...nodeData.data } };
                }
            });

            this.editor.on('nodeUnselected', () => {
                this.selectedNode = null;
            });

            this.editor.on('connectionCreated', (connection) => {
                this.propagateEntityType(connection.output_id, connection.input_id);
            });
        },

        handleClickOutside(event) {
            const dropdown = this.$el.querySelector('.load-dropdown');
            if (dropdown && !dropdown.contains(event.target)) {
                this.showLoadDropdown = false;
            }
        },

        toggleLoadDropdown() {
            this.showLoadDropdown = !this.showLoadDropdown;
        }
    }
};
</script>

<style scoped>
.workflow-builder-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 180px);
    max-height: 750px;
    min-height: 600px;
    background: #fff;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
}

.workflow-content {
    display: flex;
    flex: 1;
    overflow: hidden;
    min-height: 0;
}

/* Drawflow Node Overrides */
:deep(.node-event) {
    background: #dbeafe !important;
    border: 2px solid #3b82f6 !important;
}

:deep(.node-condition) {
    background: #fef3c7 !important;
    border: 2px solid #f59e0b !important;
}

:deep(.node-action) {
    background: #d1fae5 !important;
    border: 2px solid #10b981 !important;
}

:deep(.node-content) {
    padding: 0.5rem;
}

:deep(.node-header) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
}

:deep(.node-description) {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
}
</style>
