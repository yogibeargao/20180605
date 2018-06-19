<template>
  <r-page>
      <top title="实习总结评价" :showBack="true"/>
      <r-body>
             <r-card title="实习报告表："  :list="fileListData" />
             <r-card title="成绩评定表：">
                <r-input title="专业学习情况分:"  placeholder="最高15分" :readonly="!isShow"   :max="100" :min="0"  :model="this" value="v_score_1" :isNumber="true"/>
                <r-input title="顶岗实习小结分:"  placeholder="最高20分" :readonly="!isShow"   :max="100" :min="0"  :model="this" value="v_score_2" :isNumber="true"/>
                <r-textarea title="评价:" :readonly="!isShow"  :model="this" value="comments" :height="600" :max="600"></r-textarea>
             </r-card>
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
                                      <r-button :onClick="download">下载全部实习报告</r-button>
                                  </r-box>
                                </r-cell>
                    </r-cell>
              </r-tab-bar>
  </r-page>
</template>

<script>

import Vue from 'vue';
import {ConfirmApi } from "rainbow-mobile-core";

export default {
  data() {
    return {
      comments: null,
      score:null,
      v_score_1:null,
      v_score_2:null,
      state:null,
      isShow:false,
      fileListData: []
    };
  },
  methods: {
    async download(){
        const id = this.$route.query.id;
        window.location.href=Vue.http.options.root+"/intern/summary/download?internSummaryId="+id
    },
    async submit() {
                  const id = this.$route.query.id;
                  if(!this.v_score_1){
                      ConfirmApi.show(this,{
                            title: '',
                            content: '请输入专业学习情况分'
                      });
                  }else if(this.v_score_1 > 15 || this.v_score_1 < 0){
                      ConfirmApi.show(this,{
                            title: '',
                            content: '专业学习情况分数<br/>评分规则为[0-15分]！'
                      });
                  }else if(!this.v_score_2){
                      ConfirmApi.show(this,{
                            title: '',
                            content: '请输入顶岗实习小结分'
                      });
                  }else if(this.v_score_2 > 20 || this.v_score_1 < 0){
                      ConfirmApi.show(this,{
                            title: '',
                            content: '顶岗实习小结分数<br/>评分规则为[0-20分]！'
                      });
                  }else if(!this.comments){
                      ConfirmApi.show(this,{
                            title: '',
                            content: '请输入评价'
                      });
                  }else{
                      const param = {"id":id,"score1":this.v_score_1,"score2":this.v_score_2,"comments":this.comments,"state":1} 
                      const list = await this.$http.post(`intern/summary/appraisal`,param);
                      if(list.body){
                            ConfirmApi.show(this,{
                                title: '',
                                content: '操作成功'
                              });
                      }else{
                              ConfirmApi.show(this,{
                                title: '',
                                content: '操作失败'
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
                        const param = {"id":id,"score1":this.v_score_1,"score2":this.v_score_2,"comments":this.comments,"state":2} 
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
                      this.score = temp_record.body.score1;
                      this.v_score_1 = temp_record.body.score1;
                      this.v_score_2 = temp_record.body.score2;
                      this.state = temp_record.body.state;
                      this.fileList = temp_record.body.fileList;

                      const files_data = [{'text':'一月份实习报告一月份实习报告.doc','link': temp_record.body.documentPath},{'text':'一月份实习报告.doc','link': temp_record.body.documentPath}];
                      this.fileListData = files_data;

                      //const files_data = [];
                      if(this.fileList){
                          _.each(this.fileList,(fileInfo,index)=>{
                              files_data.push({'text':fileInfo.fileName,'link': Vue.http.options.root+'/intern/summary/download?fileId='+id});
                          });
                          this.fileListData = files_data;
                      }
                
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


