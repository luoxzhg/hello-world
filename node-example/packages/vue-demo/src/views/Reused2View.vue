<script>

export default {
   beforeRouteEnter(to, from, next) {
      console.log('beforeRouteEnter')
      next(()=>{
         console.log('beforeRouteEnter next')
      })
   },

   beforeCreate(){
      console.log('beforeCreate')
   },

   created() {
      console.log('created')
   }
}
</script>
<script setup>
import { onBeforeUpdate } from 'vue'
import { onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, onUpdated } from 'vue';
import { useRouter, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router';

const router = useRouter()
// onBeforeCreate(()=> {
//    console.log('before create')
// })

// onCreated(() => {
//    console.log('created')
// })

onBeforeMount(() => {
   console.log('beforeMount')
})

onBeforeUnmount(() => {
   console.log('beforeUnmount')
})

onMounted(() => {
   console.log('mounted')
})

onUnmounted(() => {
   console.log('unmounted')
})

onBeforeUpdate(() => {
   console.log('beforeUpdate')
})

onUpdated(() => {
   console.log('updated')
})

onBeforeRouteLeave(() => {
   console.log('beforeRouteLeave')
})

onBeforeRouteUpdate(() => {
   console.log('beforeRouteUpdate')
})

function onclick() {
   router.push({name: 'reused', params: {p: Math.random()}})
}
</script>

<template>
   <main>
      <button @click="onclick">reused components</button>
   </main>
</template>
