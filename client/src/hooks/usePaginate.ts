import { computed, type Ref, ref, type ComputedRef, watch, onMounted } from 'vue'

export default function usePaginate<T>(list: ComputedRef<T[]> | Ref<T[]>) {
  const currPage = ref(1)
  const perPage = ref(10)

  const totalPages = computed(() => Math.ceil(list.value.length / perPage.value))

  const paginatedResults = computed(() => {
    return list.value.slice(
      pageStatus.value.startPage - 1,
      pageStatus.value.startPage + perPage.value - 1,
    )
  })

  const pageUp = () => {
    if (currPage.value <= totalPages.value) currPage.value++
  }

  const pageDown = () => {
    if (currPage.value > 1) currPage.value--
  }

  const pageStatus = computed(() => {
    const startItem = (currPage.value - 1) * perPage.value + 1
    const total = list.value.length
    const endItem = Math.min(currPage.value * perPage.value, total)
    return { startPage: startItem, endPage: endItem, total }
  })

  const pageStatusText = computed(() => {
    return `${pageStatus.value.startPage} - ${pageStatus.value.endPage} of ${pageStatus.value.total}`
  })

  onMounted(() => {
    watch(perPage, () => (currPage.value = 1))

    watch(totalPages, () => {
      if (totalPages.value < currPage.value) currPage.value = 1
    })
  })

  return {
    currPage,
    perPage,
    totalPages,
    paginatedResults,
    pageUp,
    pageDown,
    pageStatus,
    pageStatusText,
    forComponent: () => ({
      currPage: currPage.value,
      'onUpdate:currPage': (val: number) => (currPage.value = val),
      perPage: perPage.value,
      'onUpdate:perPage': (val: number) => (perPage.value = val),
      pageStatusText: pageStatusText.value,
      totalPages: totalPages.value,
      onPageDown: pageDown,
      onPageUp: pageUp,
    }),
  }
}
