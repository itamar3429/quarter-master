<script setup lang="ts" generic="T extends string | number">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useMainStore } from '@/stores/main';
import FormControlIcon from '@/components/template/form/FormControlIcon.vue';

const props = defineProps<{
  name?: string;
  id?: string;
  autocomplete?: string;
  maxlength?: string;
  placeholder?: string;
  inputmode?: string | null;
  icon?: string | null;
  options?: { id: T; label: string }[];
  type: 'text' | 'select' | 'textarea' | 'password';
  modelValue: T | null;
  required?: boolean;
  borderless?: boolean;
  transparent?: boolean;
  ctrlKFocus?: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'setRef']);

const computedValue = computed({
  get: () => props.modelValue as any,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const inputElClass = computed(() => {
  const base = [
    'px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full',
    'dark:placeholder-gray-400',
    computedType.value === 'textarea' ? 'h-24' : 'h-12',
    props.borderless ? 'border-0' : 'border',
    props.transparent ? 'bg-transparent' : 'bg-white dark:bg-slate-800',
  ];

  if (props.icon) {
    base.push('pl-10');
  }

  return base;
});

const computedType = computed(() => props.type || 'text');

const controlIconH = computed(() => (props.type === 'textarea' ? 'h-full' : 'h-12'));

const mainStore = useMainStore();

const selectEl = ref(null);

const textareaEl = ref(null);

const inputEl = ref<any>(null);

onMounted(() => {
  if (selectEl.value) {
    emit('setRef', selectEl.value);
  } else if (textareaEl.value) {
    emit('setRef', textareaEl.value);
  } else {
    emit('setRef', inputEl.value);
  }
});

if (props.ctrlKFocus) {
  const fieldFocusHook = (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      inputEl.value.focus();
    } else if (e.key === 'Escape') {
      inputEl.value.blur();
    }
  };

  onMounted(() => {
    if (!mainStore.isFieldFocusRegistered) {
      window.addEventListener('keydown', fieldFocusHook);
      mainStore.isFieldFocusRegistered = true;
    } else {
      // console.error('Duplicate field focus event')
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', fieldFocusHook);
    mainStore.isFieldFocusRegistered = false;
  });
}
</script>

<template>
  <div class="relative">
    <select
      class="rtl:order-last"
      v-if="computedType === 'select'"
      :id="id"
      v-model="computedValue"
      :name="name"
      :class="inputElClass.concat(['rtl:pl-0 rtl:pr-10'])"
    >
      <option v-for="option in options" :key="option.id ?? option" :value="option.id">
        {{ option.label ?? option }}
      </option>
    </select>
    <textarea
      v-else-if="computedType === 'textarea'"
      :id="id"
      v-model="computedValue"
      :class="inputElClass"
      :name="name"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :required="required"
    />
    <input
      v-else
      :id="id"
      ref="inputEl"
      v-model="computedValue"
      :name="name"
      :maxlength="maxlength"
      :inputmode="inputmode as any"
      :autocomplete="autocomplete"
      :required="required"
      :placeholder="placeholder"
      :type="computedType"
      :class="inputElClass"
    />
    <FormControlIcon
      v-if="icon"
      class="rtl:order-first rtl:right-0"
      :icon="icon"
      :h="controlIconH"
    />
  </div>
</template>
