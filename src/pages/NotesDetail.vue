<template>
  <r-page>
             <top title="消息详情" :showBack="true"/>
             <r-body>
              <r-card>
                  <r-input title="标题" :model="this" value="title" :readonly="true"/>
                  <r-textarea :readonly="true" placeholder="消息详情" :model="this" value="content" :height="517" :max="300"></r-textarea>
              </r-card>
             </r-body>
  </r-page>
</template>

<script>
import {ConfirmApi } from "rainbow-mobile-core";

export default {
  components: {
    ConfirmApi
  },
  data() {
    return {
      title: this.$route.query.title,
      content:  this.$route.query.content,
    };
  },
  methods: {
    onChange() {}
  },
  async mounted(){
              const id = this.$route.query.id;
              const type = this.$route.query.type;
              let url = null;
              if(type=='true'){
                url = 'message/readed?messageId='+id
              }else{
                url = 'article/readed?articleReadId='+id
              }
              const resault = await this.$http.get(url);
              if(!_.isEmpty(resault.body)){
                          ConfirmApi.show(this,{
                            content: '更新消息失败',
                           });
               }
               document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
};
</script>


