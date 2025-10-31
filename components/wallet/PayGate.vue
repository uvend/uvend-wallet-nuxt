<template>
    <div class="overflow-y hide-scrollbar">
      <iframe
        ref="iframe"
        name="paygateFrame" 
        style="width:100%; height:600px; border:none;"
        @load="handleMessage"
        class="hide-scrollbar"
        ></iframe>
  
      <form
        id="paygateForm"
        action="https://secure.paygate.co.za/payweb3/process.trans"
        method="POST"
        target="paygateFrame"
        ref="form"
      >
        <input type="hidden" name="PAY_REQUEST_ID" :value="pay_request_id" />
        <input type="hidden" name="CHECKSUM" :value="checksum" />
      </form>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      pay_request_id: {
        type: String,
        required: true
      },
      checksum: {
        type: String,
        required: true
      }
    },
    methods:{
        handleMessage(event) {
            console.log(event)
            if (event.data?.status === 'done') {
                this.$emit("payment-complete", event.data);
            }
        }
    },
    mounted() {
        window.addEventListener('message', this.handleMessage)
        this.$refs.form.submit();
    },
    onBeforeUnmount(){
        window.removeEventListener('message', this.handleMessage)
    }
    
  }
  </script>