// Import/Export Methods Mixin
export const importExportMethods = {
    methods: {
        triggerImport() {
            this.$refs.fileInput.click();
        },

        handleImport(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    this.validateAndImport(json);
                } catch (error) {
                    this.$emitter.emit('add-flash', { type: 'error', message: 'Invalid JSON file' });
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        },

        validateAndImport(json) {
            if (!json.drawflow) {
                this.$emitter.emit('add-flash', { type: 'error', message: 'Invalid workflow format' });
                return;
            }
            this.importData(json);
            this.$emitter.emit('add-flash', { type: 'success', message: 'Workflow imported successfully' });
        },

        importData(data) {
            this.editor.clear();
            this.editor.import(data);
            this.canvasUpdateTrigger++;
        },

        exportWorkflow() {
            const data = this.editor.export();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `workflow_${(this.currentWorkflowName || 'untitled').replace(/\s+/g, '_').toLowerCase()}_${timestamp}.json`;
            
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            
            URL.revokeObjectURL(url);
            this.$emitter.emit('add-flash', { type: 'success', message: 'Workflow exported successfully' });
        },

        previewJSON() {
            this.showPreviewModal = true;
        },

        copyJSON() {
            navigator.clipboard.writeText(this.formattedJSON).then(() => {
                this.$emitter.emit('add-flash', { type: 'success', message: 'JSON copied to clipboard' });
            });
        },

        downloadJSON() {
            this.exportWorkflow();
            this.showPreviewModal = false;
        }
    }
};
