<template>
    <div class="node-palette">
        <h3 class="palette-title">Workflow Nodes</h3>
        
        <!-- Event Triggers Category -->
        <div class="node-category">
            <h4 class="category-title">Event Triggers</h4>
            <div class="node-grid">
                <!-- Lead Events -->
                <div 
                    v-for="event in eventNodes.leads"
                    :key="event.event"
                    class="palette-node node-event"
                    draggable="true"
                    @dragstart="$emit('drag-start', $event, event)"
                    :title="event.label"
                >
                    <i :class="event.icon"></i>
                    <span class="node-label" v-html="event.label.replace(' ', '<br>')"></span>
                </div>

                <!-- Activity Events -->
                <div 
                    v-for="event in eventNodes.activities"
                    :key="event.event"
                    class="palette-node node-event"
                    draggable="true"
                    @dragstart="$emit('drag-start', $event, event)"
                    :title="event.label"
                >
                    <i :class="event.icon"></i>
                    <span class="node-label" v-html="event.label.replace(' ', '<br>')"></span>
                </div>

                <!-- Person Events -->
                <div 
                    v-for="event in eventNodes.persons"
                    :key="event.event"
                    class="palette-node node-event"
                    draggable="true"
                    @dragstart="$emit('drag-start', $event, event)"
                    :title="event.label"
                >
                    <i :class="event.icon"></i>
                    <span class="node-label" v-html="event.label.replace(' ', '<br>')"></span>
                </div>

                <!-- Quote Events -->
                <div 
                    v-for="event in eventNodes.quotes"
                    :key="event.event"
                    class="palette-node node-event"
                    draggable="true"
                    @dragstart="$emit('drag-start', $event, event)"
                    :title="event.label"
                >
                    <i :class="event.icon"></i>
                    <span class="node-label" v-html="event.label.replace(' ', '<br>')"></span>
                </div>
            </div>
        </div>

        <!-- Conditions Category -->
        <div class="node-category">
            <h4 class="category-title">Conditions</h4>
            <div class="node-grid">
                <div 
                    v-for="condition in conditionNodes"
                    :key="condition.entity"
                    class="palette-node node-condition"
                    draggable="true"
                    @dragstart="$emit('drag-start', $event, condition)"
                    :title="condition.label"
                >
                    <i :class="condition.icon"></i>
                    <span class="node-label" v-html="condition.label.replace(' ', '<br>')"></span>
                </div>
                
                <div v-if="conditionNodes.length === 0" class="no-nodes-message">
                    Add an Event node first
                </div>
            </div>
        </div>

        <!-- Actions Category -->
        <div class="node-category">
            <h4 class="category-title">Actions</h4>
            <div class="node-grid">
                <div 
                    v-for="action in actionNodes"
                    :key="action.actionType"
                    class="palette-node node-action"
                    draggable="true"
                    @dragstart="$emit('drag-start', $event, action)"
                    :title="action.label"
                >
                    <i :class="action.icon"></i>
                    <span class="node-label" v-html="action.label.replace(' ', '<br>')"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NodePalette',
    
    props: {
        eventNodes: {
            type: Object,
            required: true
        },
        conditionNodes: {
            type: Array,
            default: () => []
        },
        actionNodes: {
            type: Array,
            default: () => []
        }
    },
    
    emits: ['drag-start']
};
</script>

<style scoped src="../styles/palette.css"></style>
