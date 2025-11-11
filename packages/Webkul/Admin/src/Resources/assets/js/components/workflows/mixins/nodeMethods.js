// Node Operations Methods Mixin
export const nodeMethods = {
    methods: {
        createNodeHTML(data, nodeType) {
            return `
                <div class="node-content">
                    <div class="node-header">
                        <i class="${nodeType.icon}"></i>
                        <span>${data.title}</span>
                    </div>
                    ${data.description ? `<div class="node-description">${data.description}</div>` : ''}
                </div>
            `;
        },

        handleDragStart(event, nodeData) {
            event.dataTransfer.setData('application/json', JSON.stringify(nodeData));
            event.dataTransfer.effectAllowed = 'copy';
        },

        handleDragOver(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        },

        handleDrop(event) {
            event.preventDefault();
            
            try {
                const nodeData = JSON.parse(event.dataTransfer.getData('application/json'));
                if (!this.editor) return;

                // Check if node type already exists
                const existingNodes = this.editor.export().drawflow.Home.data;
                const nodeTypeExists = Object.values(existingNodes).some(node => {
                    return node.data.nodeType === nodeData.type;
                });

                if (nodeTypeExists) {
                    const labels = { 'event': 'Event Trigger', 'condition': 'Condition', 'action': 'Action' };
                    this.$emitter.emit('add-flash', { 
                        type: 'warning', 
                        message: `Only one ${labels[nodeData.type]} node allowed per workflow` 
                    });
                    return;
                }

                // Get drop position
                const canvasRect = this.$refs.canvasComponent.$refs.drawflowContainer.getBoundingClientRect();
                const posX = event.clientX - canvasRect.left;
                const posY = event.clientY - canvasRect.top;

                // Create node data
                const newNodeData = {
                    title: nodeData.label,
                    description: '',
                    metadata: {},
                    nodeType: nodeData.type,
                    entity: nodeData.entity || '',
                    event: nodeData.event || '',
                    actionType: nodeData.actionType || '',
                    icon: nodeData.icon || 'icon-add'
                };

                const nodeHtml = this.createNodeHTML(newNodeData, nodeData);

                // Configure inputs/outputs based on node type
                let inputs = 1, outputs = 1;
                if (nodeData.type === 'event') { 
                    inputs = 0; 
                    outputs = 1; 
                } else if (nodeData.type === 'action') { 
                    inputs = 1; 
                    outputs = 0; 
                }

                // Add node to canvas
                const nodeId = this.editor.addNode(
                    nodeData.type, inputs, outputs, posX, posY,
                    `node-${nodeData.type}`, newNodeData, nodeHtml, false
                );

                // Auto-connect nodes
                this.autoConnectNodes(nodeId, nodeData.type);
                
                // Trigger update for condition filtering
                if (nodeData.type === 'event') {
                    this.canvasUpdateTrigger++;
                }
            } catch (error) {
                console.error('Error dropping node:', error);
            }
        },

        autoConnectNodes(newNodeId, newNodeType) {
            try {
                const exportData = this.editor.export();
                const nodes = exportData.drawflow?.Home?.data || {};
                
                let eventNodeId = null, conditionNodeId = null, actionNodeId = null;
                
                Object.keys(nodes).forEach(id => {
                    const node = nodes[id];
                    if (node.data?.nodeType === 'event') eventNodeId = id;
                    if (node.data?.nodeType === 'condition') conditionNodeId = id;
                    if (node.data?.nodeType === 'action') actionNodeId = id;
                });
                
                // Auto-connect based on workflow flow
                if (newNodeType === 'condition' && eventNodeId) {
                    this.editor.addConnection(eventNodeId, newNodeId, 'output_1', 'input_1');
                    if (actionNodeId) {
                        this.editor.removeSingleConnection(eventNodeId, actionNodeId, 'output_1', 'input_1');
                        this.editor.addConnection(newNodeId, actionNodeId, 'output_1', 'input_1');
                    }
                } else if (newNodeType === 'action') {
                    if (conditionNodeId) {
                        this.editor.addConnection(conditionNodeId, newNodeId, 'output_1', 'input_1');
                    } else if (eventNodeId) {
                        this.editor.addConnection(eventNodeId, newNodeId, 'output_1', 'input_1');
                    }
                } else if (newNodeType === 'event') {
                    if (conditionNodeId) {
                        this.editor.addConnection(newNodeId, conditionNodeId, 'output_1', 'input_1');
                    } else if (actionNodeId) {
                        this.editor.addConnection(newNodeId, actionNodeId, 'output_1', 'input_1');
                    }
                }
                
                this.editor.updateConnectionNodes(`node-${newNodeId}`);
            } catch (error) {
                console.error('Error auto-connecting nodes:', error);
            }
        },

        propagateEntityType(sourceNodeId, targetNodeId) {
            const sourceNode = this.editor.getNodeFromId(sourceNodeId);
            const targetNode = this.editor.getNodeFromId(targetNodeId);
            if (!sourceNode || !targetNode) return;

            if (sourceNode.data.nodeType === 'event' && sourceNode.data.entity) {
                if (targetNode.data.nodeType === 'condition' || targetNode.data.nodeType === 'action') {
                    targetNode.data.entity = sourceNode.data.entity;
                    this.editor.updateNodeDataFromId(targetNodeId, targetNode.data);
                }
            }
        }
    }
};
