<template>
  <div>
                <r-card v-if="showClass">
                    <r-selector  title="班级" :options="classes" :model="this.condition" value="class" :onChange="classChange"></r-selector>
                    <r-row title="学生" :model="this" value="v_student"  :onClick="showStudent" :isLink="true" ></r-row>
                </r-card>
                <r-card v-if="showTime">
                  <r-date-time  title='开始时间' :model="this.condition" value="startDateStr" format="YYYY-MM-DD HH:mm:00"  :minuteList="['00', '15', '30', '45']" :onChange="search"></r-date-time>
                  <r-date-time  title='结束时间' :model="this.condition" value="endDateStr" format="YYYY-MM-DD HH:mm:00"  :minuteList="['00', '15', '30', '45']" :onChange="search"></r-date-time>
                </r-card>
                <r-dialog :model="this" value="showDialog" :disableMask="false">
                    <r-checker :model="this.condition" value="student" :data='students' type="list" :onChange="onChange"/>
                </r-dialog>
                <r-toast :model="this" value="showFlag" :text="toastText" :type='type'/>
  </div>
</template>

<script>
import Util from "../util/util";

export default {
   props: {
    showClass: { 
        type: Boolean, 
        default: true 
    },
    showTime: { 
        type: Boolean, 
        default: true 
    },
    condition: { 
        type: Object, 
        required: true 
    },
    callBack:{ 
        type: Function, 
        required: true 
    },
  },
  data() {
    return {
       data:{
        "head":[
          [{'text':'时间'},{'text':'地点'}]
        ],
        "body":[]
      },
      classes:[],
      class:"",
      options2:[['张三','李四']],
      startDate:"",
      endDate:"",
      student_Nos:[],
      students:[],
      student:[],
      v_student:[],
      show:false,
      showFlag:false,
      toastText:"",
      type:"success",
      showDialog:false
    };
  },
  computed :{
      disableButton(){
        return _.isEmpty(this.student);
      }
    
  },
  methods:{
    search(){
        this.callBack?this.callBack(this.condition):()=>{}; 
    },
    shareCreate(){
        this.show=true;
    },
  
    showStudent(){
        this.showDialog=true;
    },
    onChange(){
                  const v_student_List = [];
                  const student_Nos = [];
                  let all_student_Nos = [];
                  let all_student_flag = false;
                  _.each(this.students,(cla)=>{
                      _.each(this.condition.student,(pcla)=>{
                            all_student_Nos.push(cla.key);
                            if(!all_student_flag&&pcla=='all'){
                                all_student_flag = true;
                            }
                            if(pcla==cla.key){
                                  v_student_List.push(cla.value);
                                  student_Nos.push(cla.key);
                            }
                      });
                  });
                  this.v_student = _.isEmpty(v_student_List)?"":v_student_List.join(",");
                  this.condition.student_Nos = student_Nos;
                  if(all_student_flag){
                      all_student_Nos.shift();
                    this.condition.student_Nos = all_student_Nos;
                  }
                  this.condition.v_student = this.v_student;
                  if(!_.isEmpty(student_Nos)){
                     this.search();
                  }
                
    },
    async classChange(){
                  const identityId = Util.getIdentityId(this);
                  const students = await this.$http.get(`user/class/students?identityId=${identityId}&&classNo=${this.condition.class}`);
                  const _students = [];
                  _students.push({"key":'all',"value":"全部学生"})
                  _.each(students.body,(stu)=>{
                      _students.push({"key":stu.studentNo,"value":stu.studentName})
                  });
                  this.students=_students;
    }
  },
  async mounted(){
                if(this.showClass){
                    const identityId = Util.getIdentityId(this);
                    const classes = await this.$http.get(`user/teacherclass?identityId=${identityId}`);
                    this.classes = _.map(classes.body,(cla)=>{
                        return {"key":cla.classNo,"value":cla.className}
                    })
                }
                  
  },
  created(){
      if(!this.condition.startDateStr){
          this.condition.startDateStr="";
      }
      if(!this.condition.endDateStr){
          this.condition.endDateStr="";
      }
  }
};
</script>


