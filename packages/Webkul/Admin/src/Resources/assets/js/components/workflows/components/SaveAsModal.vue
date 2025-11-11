<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h3>Save Workflow As</h3>
                <button type="button" class="close-button" @click="$emit('close')">
                    <i class="icon-cross"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="form-field">
                    <label for="workflow-name">Workflow Name</label>
                    <input 
                        id="workflow-name"
                        :value="name" 
                        @input="$emit('update:name', $event.target.value)"
                        type="text"
                        class="form-input"
                        placeholder="Enter workflow name"
                    />
                </div>
            </div>
            
            <div class="modal-footer">
                <button type="button" class="secondary-button" @click="$emit('close')">
                    Cancel
                </button>
                <button type="button" class="primary-button" @click="$emit('save')" :disabled="!name">
                    Save
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SaveAsModal',
    
    props: {
        name: {
            type: String,
            default: ''
        }
    },
    
    emits: ['close', 'save', 'update:name']
};
</script>

<style scoped src="../styles/modal.css"></style>
