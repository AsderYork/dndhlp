<template>
    <span>
        <span v-if="editable">
            <span @click="startEditing" v-if="!isEditing">
                {{ changableValue }}
            </span>
            <span v-else>
            <textarea v-if="isTextarea" :type="htmlType" v-model="tmpValue" class="form-control" ref="editableField" @blur="stopEditing" @keydown="keydown"></textarea>
            <input v-else :type="htmlType" v-model="tmpValue" class="form-control" ref="editableField" @blur="stopEditing" @keydown="keydown" />
            </span>
        </span>
        <span v-else>
            {{ changableValue }}
        </span>
    </span>
</template>


<script>
export default {
    props: {
        value: {},
        isTextarea: {
            type: Boolean,
            default: false,
        },
        editable: {
            type: Boolean,
            default: false,
        },
        selectOnEdit: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            default: "text",
        },

    },
    data() {
        return {
            content: this.value,
            isEditing: false,
            tmpValue: this.value,
        }
    },
    watch: {
        value(newValue) {
            this.content = newValue;
            this.content = newValue;
        }
    },
    
    computed: {
        changableValue: {
            get() {
                if(!this.content) {
                    return '-empty-';
                }
                return this.content;
            },
            set(val) {
                if(['numberex', 'number'].includes(this.type)) {
                    val = parseInt(val);
                }
                this.content = val;
                this.handleInput();
            },
        },
        htmlType() {
            if (this.type === 'numberex') { return 'text'; }
            return this.type;
        }
    },
    methods: {
        handleInput() {
            this.$emit('input', this.content)
        },
        startEditing() {
            this.isEditing = true;
            this.tmpValue = this.changableValue;
            this.$nextTick(() => {
                if (this.selectOnEdit) {
                    this.$refs.editableField.select();
                } else {
                    this.$refs.editableField.focus();
                }
            });
        },
        stopEditing() {
            this.isEditing = false;
            if (['numberex', 'number'].includes(this.type) && this.tmpValue != '') {
                if (this.type === 'numberex' && (typeof this.tmpValue === 'string' || this.tmpValue instanceof String)) {
                    this.tmpValue = eval(this.tmpValue.replace(/[^-()\d/*+.]/g, ''));

                }
                this.changableValue = this.tmpValue;
            } else {
                this.changableValue = this.tmpValue;
            }
        },
        keydown(e) {
            if (e.which == 13) {
                this.stopEditing();
            }
            if (this.type === 'numberex' && (!'1234567890+-*/ '.split('').concat(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace']).includes(e.key))) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }
}
</script>