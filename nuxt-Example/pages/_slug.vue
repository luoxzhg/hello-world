<template lang="pug">
div
    h1 动态URL页面
    NuxtLink(to="/") Home
    p {{this.slug}}
</template>

<script>
export default {
    data() {
        return {
            post: null
        }
    },

    async asyncData(context) {
        console.log('asyncData called')
        const slug = context.params.slug
        return {book, slug}
    },

    async fetch() {
        console.log('fetch called')
        const res = await fetch('https://api.nuxtjs.dev/posts/1')
        this.post = res.json()
    },
    fetchOnServer: false
}
</script>
