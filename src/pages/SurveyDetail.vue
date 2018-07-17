<template>
  <r-page>
      <top title="走访记录详情" :showBack="true"/>
      <r-body>
            <r-row title="姓名" :model="this.survey" value='studentName'/>
            <r-row title="学号" :model="this.survey" value='studentNo'/>
             <r-card>
                  <r-date-time  title='走访时间' :readonly="isShowDetail" :model="this.survey" value="surveryTimeStr" format="YYYY-MM-DD HH:mm" :hourList="['09', '10', '11', '12', '13', '14', '15', '16', '17', '18']" :minuteList="['00', '15', '30', '45']"></r-date-time>
             </r-card>
             <r-input title="走访地点" :readonly="isShowDetail" :required="true" :model="this.survey" value="location" placeholder="请输入走访地点"/>
             <r-input title="走访单位" :readonly="isShowDetail" :required="true" :model="this.survey" value="enterpriseName" placeholder="请输入走访单位"/>
             <r-textarea title="调研情况:"  :readonly="isShowDetail"  :model="this.survey" value="surveyComments" :height="600" :max="600"></r-textarea>
       </r-body>
       <r-tab-bar v-if="!isShowDetail">

                      
          <div class="example-simple">
            <div class="upload" >
              <ul>
                <li v-for="file in files" :key="file.id">
                  <span>{{file.name}}</span> -
                  <span>{{file.size | formatSize}}</span> -
                  <span v-if="file.error">{{file.error}}</span>
                  <span v-else-if="file.success">上传成功<br/>走访记录提交成功!</span>
                  <span v-else-if="file.active">active</span>
                  <span v-else-if="file.active">active</span>
                  <span v-else></span>
                </li>
              </ul>
              <div class="example-btn">
                <file-upload
                  class="btn btn-primary"
                  :multiple="true"
                  :size="1024 * 1024 * 10"
                  v-model="files"
                  name="file" 
                  :custom-action="customAction"
                  @input-filter="inputFilter"
                  @input-file="inputFile"
                  ref="upload">
                  <i class="fa fa-plus white"></i>
                  选择文件
                </file-upload>
                <button type="button" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
                  <i class="fa fa-arrow-up white" aria-hidden="true"></i>
                  上传并提交
                </button>
                <button type="button" class="btn btn-danger"  v-else @click.prevent="$refs.upload.active = false">
                  <i class="fa fa-stop white" aria-hidden="true"></i>
                  停止上传
                </button>
              </div>
            <!--  <r-cell type="row" :vertical="true">
                  <r-cell >
                    <r-box>
                        <r-button :onClick="download">下载走访记录照片</r-button>
                    </r-box>
                  </r-cell>
              </r-cell> -->
            </div>
            
          </div>
      </r-tab-bar>
  </r-page>
</template>

<script>
import Util from "../util/util";
import FileUpload from 'vue-upload-component';
import Vue from 'vue';

export default {
  components: {
    FileUpload,
  },
  data() {
    return {
      files: [],
      survey:{}
    };
  },
  methods: {
      async download() {
        //window.location.href=Vue.http.options.root+"/intern/summary/template/download";
      },
      async customAction(file, component){

            const self = this;
            const formData = new FormData();
            formData.append('files', file.file);
            
            const id = this.$route.query.id;
            const studentNo = this.$route.query.studentNo;
            const identityId = Util.getIdentityId(this);
            var surveyInfo = {};

            surveyInfo.surveryId = id;
            surveyInfo.teacherNo = identityId;
            surveyInfo.studentNo = this.survey.studentNo ? this.survey.studentNo: studentNo;
            surveyInfo.surveryTime = this.survey.surveryTimeStr+":00";
            surveyInfo.location = this.survey.location;
            surveyInfo.enterpriseName = this.survey.enterpriseName;
            surveyInfo.surveyComments = this.survey.surveyComments;

            var surveyInfoStr = JSON.stringify(surveyInfo); // 将jsobObject转换为json字符串
          
            formData.append('survey', surveyInfoStr);
            return await self.$http.post(`intern/student/intern/survey/create`,formData);
            
    },
   inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前
        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
      }
    },
    inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        // add
        console.log('add', newFile)
      }
      if (newFile && oldFile) {
        // update
        console.log('update', newFile)
      }
      if (!newFile && oldFile) {
        // remove
        console.log('remove', oldFile)
      }
    }
  },
  computed:{
                  isShowDetail(){
                    const surveyId = this.$route.query.surveryId;
                    if(surveyId){
                        return true;
                    }else{
                        if(!Util.isSchoolTeacher(this)){
                            return true;
                        }else{
                            return false;
                        }
                    }
                  }
  },
  async mounted(){
                   if(this.$route.query.studentNo){
                      const url = "user/detail?identityId="+this.$route.query.studentNo;
                      const signList = await this.$http.get(url);
                      this.survey = signList.body.student;
                        
                   }

                    const id = this.$route.query.id;
                    if(id){
                      const url = `intern/student/intern/survey/detail?surveryId=`+id;  
                      const list = await this.$http.get(url);
                      if(list.body){
                          list.body.surveryTimeStr = list.body.surveryTime?list.body.surveryTime.substring(0,16):"";
                          list.body.location = list.body.location?list.body.location:"";
                          list.body.enterpriseName = list.body.enterpriseName?list.body.enterpriseName:"";
                          list.body.surveyComments = list.body.surveyComments?list.body.surveyComments:"";
                          list.body.studentNo = list.body.studentNo?list.body.studentNo:"";
                          this.survey = list.body;

                          //this.user.studentNo = list.body.studentNo?list.body.studentNo:"";


                          console.log(this.survey)
                          delete this.survey["surveryTime"];
                      }
                    }
  },
  

};
</script>


<style>
.upload li{
  color: black;
}
.white{
  color: white;
}
.example-simple{
    text-align: center;
    width: 100%;
}
.example-simple label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
.btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    padding: .5rem .75rem;
    font-size: 1rem;
    line-height: 1.25;
    border-radius: .25rem;
    transition: all .15s ease-in-out;
}
.btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
}
.file-uploads {
    overflow: hidden;
    position: relative;
    text-align: center;
    display: inline-block;
}
.btn-success {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745;
}
[type=reset], [type=submit], button, html [type=button] {
    -webkit-appearance: button;
}
button, select {
    text-transform: none;
}
button, input {
    overflow: visible;
}
</style>