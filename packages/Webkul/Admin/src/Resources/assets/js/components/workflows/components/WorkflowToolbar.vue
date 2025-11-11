<template>
    <div class="workflow-toolbar">
        <!-- Left Group - New & Load -->
        <div class="toolbar-group">
            <button type="button" class="secondary-button" @click="$emit('new-workflow')">
                <i class="icon-add"></i>
                New
            </button>
            
            <div class="load-dropdown">
                <button type="button" class="secondary-button" @click="$emit('toggle-load-dropdown')">
                    <i class="icon-folder"></i>
                    Load
                </button>
                <div v-if="showLoadDropdown" class="dropdown-menu">
                    <div v-if="savedWorkflows.length === 0" class="dropdown-item-disabled">
                        No saved workflows
                    </div>
                    <a 
                        v-for="workflow in savedWorkflows" 
                        :key="workflow.id"
                        href="#"
                        class="dropdown-item"
                        @click.prevent="$emit('load-workflow', workflow.id)"
                    >
                        {{ workflow.name }}
                    </a>
                </div>
            </div>
        </div>

        <!-- Middle Group - Import, Export, Preview -->
        <div class="toolbar-group">
            <button type="button" class="secondary-button" @click="$emit('import')">
                <i class="icon-import"></i>
                Import
            </button>
            
            <button type="button" class="secondary-button" @click="$emit('export')">
                <i class="icon-export"></i>
                Export
            </button>
            
            <button type="button" class="secondary-button" @click="$emit('preview')">
                <i class="icon-eye"></i>
                Preview JSON
            </button>
        </div>

        <!-- Right Group - Save -->
        <div class="toolbar-group">
            <button type="button" class="primary-button" @click="$emit('save')">
                <i class="icon-save"></i>
                Save
            </button>
            
            <button type="button" class="secondary-button" @click="$emit('save-as')">
                <i class="icon-save"></i>
                Save As
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WorkflowToolbar',
    
    props: {
        savedWorkflows: {
            type: Array,
            default: () => []
        },
        showLoadDropdown: {
            type: Boolean,
            default: false
        }
    },
    
    emits: ['new-workflow', 'toggle-load-dropdown', 'load-workflow', 'import', 'export', 'preview', 'save', 'save-as']
};
</script>

<style scoped src="../styles/toolbar.css"></style>
