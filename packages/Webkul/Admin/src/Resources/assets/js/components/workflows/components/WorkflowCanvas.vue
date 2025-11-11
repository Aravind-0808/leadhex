<template>
    <div class="canvas-container">
        <div id="drawflow" ref="drawflowContainer"></div>
        
        <!-- Empty State Placeholder -->
        <div v-if="!hasNodes" class="canvas-placeholder">
            <div class="placeholder-content">
                <i class="icon-settings-flow placeholder-icon"></i>
                <h3 class="placeholder-title">Build Your Workflow</h3>
                <p class="placeholder-text">Drag and drop nodes from the left panel to create your automated workflow</p>
                <div class="placeholder-steps">
                    <div class="placeholder-step">
                        <span class="step-number">1</span>
                        <span class="step-text">Add an Event Trigger</span>
                    </div>
                    <div class="placeholder-step">
                        <span class="step-number">2</span>
                        <span class="step-text">Add a Condition (optional)</span>
                    </div>
                    <div class="placeholder-step">
                        <span class="step-number">3</span>
                        <span class="step-text">Add an Action</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WorkflowCanvas',
    
    props: {
        hasNodes: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style scoped src="../styles/canvas.css"></style>
