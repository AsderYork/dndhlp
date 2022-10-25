<template>
    <span>
        <span v-if="editable">
            <span @click="startEditing" v-if="!isEditing">
                {{changableValue}}
            </span>
            <input type="text" v-else v-model="tmpValue" class="form-control" ref="editableField" @blur="stopEditing" @keydown="keydown"/>
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
        editable: {
            type: Boolean,
            default: false,
        },

    },
    data() {
        return {
            content: this.value,
            isEditing: false,
            tmpValue: this.value,
        }
    },
    computed: {
        changableValue: {
            get() {
                return this.content;
            },
            set(val) {
                this.content = val;
                this.handleInput();

            }
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
                this.$refs.editableField.select();
            });
        },
        stopEditing() {
            this.isEditing = false;
            if(this.tmpValue != '') {
                this.changableValue = this.tmpValue;
            }
        },
        keydown(e) {
            if(e.which == 13) {
                this.stopEditing();
            }
        }
    }
}
</script>