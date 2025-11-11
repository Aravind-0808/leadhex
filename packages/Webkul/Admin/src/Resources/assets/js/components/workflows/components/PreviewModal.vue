<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Workflow JSON Preview</h3>
                <button type="button" class="close-button" @click="$emit('close')">
                    <i class="icon-cross"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <pre class="json-preview">{{ formattedJson }}</pre>
            </div>
            
            <div class="modal-footer">
                <button type="button" class="secondary-button" @click="$emit('copy')">
                    <i class="icon-copy"></i>
                    Copy
                </button>
                <button type="button" class="secondary-button" @click="$emit('download')">
                    <i class="icon-download"></i>
                    Download
                </button>
                <button type="button" class="primary-button" @click="$emit('close')">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PreviewModal',
    
    props: {
        formattedJson: {
            type: String,
            required: true
        }
    },
    
    emits: ['close', 'copy', 'download']
};
</script>

<style scoped src="../styles/modal.css"></style>
