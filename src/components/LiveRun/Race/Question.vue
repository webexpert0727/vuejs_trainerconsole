<template>
  <div class="race-question">
    <sweet-modal ref="question" @close="onClose()">
    <div class="image">
        <img src="https://contattafiles.s3-us-west-1.amazonaws.com/tnt8888/hIf7gIIFd6jb9AY/q.png"/>
    <h1>Today's Question</h1>
</div>
    <div>
     <textarea id="Question" Placeholder="enter your question here"></textarea>
      </div>
      <div>
       <button class="btn btn--primary" @click="Save()">Save</button>
       </div>
    </sweet-modal>
  
  </div>
</template>

<script>
  import {
    SweetModal
  } from 'sweet-modal-vue'

  export default {
    name: 'race-question',
    props:{
      show:false
    // },
    // computed: {
    //   show: {
    //     // getter
    //     get: function() {
    //       return this.showMe
    //     },
    //     // setter
    //     set: function(newValue) {
    //       console.log(newValue)
    //       if (newValue)
    //         this.$refs.question.open()
    //     }
    //   }
    },
    components: {
      SweetModal,
    },
    mounted() {

    },
    methods: {
      onClose() {
        console.log("Closed")
        this.$parent.$emit('closed', true)
      }
    },
    watch: {
      show(oldVal, newVal) {
        console.log("Show Question Modal: " + this.show)
        if (this.show)
          this.$refs.question.open()
      }
    },
    Save () {
      debugger
    },
    created() {
      this.$watch('show', function (val) {
        console.log(val)
      })
    }
  }
</script>
