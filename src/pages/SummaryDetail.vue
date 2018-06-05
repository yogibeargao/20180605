<template>
  <r-page>
      <top title="实习总结评价" :showBack="true"/>
      <r-body>
             <r-input title="分数:" :readonly="!isShow"   :max="100" :min="0"  :model="this" value="v_score" :isNumber="true"/>
             <r-textarea title="评价:" :readonly="!isShow"  :model="this" value="comments" :height="600" :max="600"></r-textarea>
      </r-body>
             <r-tab-bar>
                  <r-cell type="row" :vertical="true">
                                <r-cell v-if="!score&&isShow">
                                  <r-box>
                                      <r-button :onClick="submit">通过</r-button>
                                  </r-box>
                                </r-cell>
                                 <r-cell v-if="!score&&isShow">
                                  <r-box>
                                      <r-button type='danger' :onClick="reject">打回</r-button>
                                  </r-box>
                                </r-cell>
                                 <r-cell >
                                  <r-box>
                                      <r-button :onClick="download">下载实习报告</r-button>
                                  </r-box>
                                </r-cell>
                    </r-cell>
              </r-tab-bar>
  </r-page>
</template>

<script>

import Vue from 'vue';

export default {
  data() {
    return {
      comments: null,
      score:null,
      v_score:null,
      state:null,
      isShow:false
    };
  },
  methods: {
    async download(){
        const id = this.$route.query.id;
        window.location.href=Vue.http.options.root+"/intern/summary/download?internSummaryId="+id
    },
    async submit() {
                  const id = this.$route.query.id;
                  if(!this.v_score){
                      ConfirmApi.show(this,{
                            title: '',
                            content: '请输入成绩',
                          });
                  }else if(!this.comments){
                      ConfirmApi.show(this,{
                            title: '',
                            content: '请输入评价',
                          });
                  }else{
                      const param = {"id":id,"score":this.v_score,"comments":this.comments,"state":1} 
                      const list = await this.$http.post(`intern/summary/appraisal`,param);
                      if(list.body){
                            ConfirmApi.show(this,{
                                title: '',
                                content: '操作成功',
                              });
                      }else{
                              ConfirmApi.show(this,{
                                title: '',
                                content: '操作失败',
                              });
                      }
                  }
                  
    },
    async reject() {
                  const id = this.$route.query.id;
                  if(!this.comments){
                      ConfirmApi.show(this,{
                            title: '',
                            content: '请输入打回理由',
                          });
                  }else{
                        const param = {"id":id,"score":this.v_score,"comments":this.comments,"state":2} 
                        const list = await this.$http.post(`intern/summary/appraisal`,param);
                        if(list.body){
                                ConfirmApi.show(this,{
                                  title: '',
                                  content: '操作成功',
                                });
                        }else{
                                ConfirmApi.show(this,{
                                  title: '',
                                  content: '操作失败',
                                });
                        }
                  }
                  
    }
  },
  async mounted(){
          const id = this.$route.query.id;
          if(id){
                  const url = "intern/summary/detail?summaryId="+id;
                  const temp_record = await this.$http.get(url);
                  if(temp_record.body){
                    this.comments = temp_record.body.comments;
                    this.score = temp_record.body.score;
                    this.v_score = temp_record.body.score;
                    this.state = temp_record.body.state;
                  }
          }
  
  },
  async created(){
                  const url = "user/processaudit?processCode=internsummary";
                  const temp_record = await this.$http.get(url);
                  this.isShow = temp_record.body;
  }
};
</script>


