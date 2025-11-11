// Workflow Management Methods Mixin
export const workflowMethods = {
    methods: {
        async loadSavedWorkflows() {
            try {
                const response = await this.$axios.get('/admin/settings/workflows');
                if (response.data && response.data.records) {
                    this.savedWorkflows = response.data.records;
                }
            } catch (error) {
                console.error('Failed to load saved workflows:', error);
            }
        },

        async loadWorkflowOptions() {
            try {
                const response = await this.$axios.get('/admin/settings/workflows/options');
                if (response.data && response.data.success) {
                    const eventsArray = response.data.events ? Object.values(response.data.events) : [];
                    this.workflowOptions = {
                        events: eventsArray,
                        conditions: response.data.conditions || {},
                        actions: response.data.actions || {}
                    };
                }
            } catch (error) {
                console.error('Failed to load workflow options:', error);
            }
        },

        newWorkflow() {
            if (confirm('Create a new workflow? Unsaved changes will be lost.')) {
                this.editor.clear();
                this.selectedNode = null;
                this.currentWorkflowId = null;
                this.currentWorkflowName = '';
                this.canvasUpdateTrigger++;
            }
        },

        async loadWorkflow(id) {
            try {
                const response = await this.$axios.get(`/admin/settings/workflows/load/${id}`);
                if (response.data && response.data.flow_json) {
                    this.importData(response.data.flow_json);
                    this.currentWorkflowId = id;
                    this.currentWorkflowName = response.data.name || '';
                    this.showLoadDropdown = false;
                    this.$emitter.emit('add-flash', { type: 'success', message: 'Workflow loaded successfully' });
                }
            } catch (error) {
                this.$emitter.emit('add-flash', { type: 'error', message: 'Failed to load workflow' });
            }
        },

        validateWorkflow() {
            const exportData = this.editor.export();
            const nodes = exportData.drawflow?.Home?.data || {};
            
            let eventCount = 0, conditionCount = 0, actionCount = 0;

            Object.values(nodes).forEach(node => {
                if (node.data?.nodeType === 'event') eventCount++;
                if (node.data?.nodeType === 'condition') conditionCount++;
                if (node.data?.nodeType === 'action') actionCount++;
            });

            if (eventCount > 1 || conditionCount > 1 || actionCount > 1) {
                this.$emitter.emit('add-flash', { type: 'error', message: 'Only one node of each type allowed' });
                return false;
            }

            if (eventCount === 0) {
                this.$emitter.emit('add-flash', { type: 'error', message: 'Workflow must have an Event Trigger' });
                return false;
            }

            if (actionCount === 0) {
                this.$emitter.emit('add-flash', { type: 'error', message: 'Workflow must have an Action' });
                return false;
            }

            return true;
        },

        async saveWorkflow() {
            if (!this.validateWorkflow()) return;

            if (!this.currentWorkflowName || this.currentWorkflowName === 'Untitled Workflow') {
                this.saveAsName = this.currentWorkflowName || '';
                this.showSaveAsModal = true;
                return;
            }

            const flowData = this.editor.export();
            const payload = { 
                id: this.currentWorkflowId, 
                name: this.currentWorkflowName, 
                flow_json: flowData 
            };

            try {
                const response = await this.$axios.post('/admin/settings/workflows/save-json', payload);
                if (response.data.success) {
                    this.currentWorkflowId = response.data.workflow_id;
                    this.$emitter.emit('add-flash', { type: 'success', message: 'Workflow saved successfully' });
                    this.loadSavedWorkflows();
                }
            } catch (error) {
                this.$emitter.emit('add-flash', { type: 'error', message: 'Failed to save workflow' });
            }
        },

        saveWorkflowAs() {
            this.saveAsName = '';
            this.showSaveAsModal = true;
        },

        async confirmSaveAs() {
            if (!this.validateWorkflow() || !this.saveAsName) return;

            const flowData = this.editor.export();
            const payload = { 
                id: null, 
                name: this.saveAsName, 
                flow_json: flowData 
            };

            try {
                const response = await this.$axios.post('/admin/settings/workflows/save-json', payload);
                if (response.data.success) {
                    this.currentWorkflowId = response.data.workflow_id;
                    this.currentWorkflowName = this.saveAsName;
                    this.showSaveAsModal = false;
                    this.$emitter.emit('add-flash', { type: 'success', message: 'Workflow saved successfully' });
                    this.loadSavedWorkflows();
                }
            } catch (error) {
                this.$emitter.emit('add-flash', { type: 'error', message: 'Failed to save workflow' });
            }
        }
    }
};
