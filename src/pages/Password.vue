<template>
  <r-page>
      <top title="修改密码" :showBack="true"/>
      <r-body>
              <r-card>
                 <r-input title="原密码" :required="true" placeholder="请输入原密码" :model="this" value="password" :isPassword="true"/>
                 <r-input title="新密码" :required="true" placeholder="请输入新密码" :model="this" value="newPassword" :isPassword="true"/>
                 <r-input title="确认密码" :required="true" placeholder="再输入新密码" :model="this" value="newPassword2" :isPassword="true"/>
              </r-card>
      </r-body>
                              <r-toast :model="this" value="showFlag" :text="toastText" :type='type'/>

              <r-tab-bar>
                  <r-cell type="row" :vertical="true">
                                <r-cell >
                                  <r-box>
                                      <r-button :onClick="submit">提交</r-button>
                                  </r-box>
                                </r-cell>
                    </r-cell>
              </r-tab-bar>
  </r-page>
</template>

<script>
import Util from "../util/util";

export default {
  data() {
    return {
      password: null,
      newPassword: null,
      newPassword2: null,
      showFlag:false,
      toastText:"",
      type:"warn"
    };
  },
  methods: {
    async submit() {
                if(this.newPassword==this.newPassword2){
                        this.user = JSON.parse(sessionStorage.getItem("user"));
                        const url = `user/login?userName=${this.user.loginName}&password=${this.password}`;
                        const login = await this.$http.get(url);
                        if(login.body.success){
                                  const url = `user/changepwd?loginName=`+this.user.loginName+"&password="+this.password+"&newpassword="+this.newPassword;
                                 const change = await this.$http.post(url);
                                 if(change.body.success){
                                      this.type ="success";
                                      this.toastText= change.body.message;
                                      this.showFlag = true;
                                  }else{
                                      this.toastText= "修改密码失败";
                                      this.showFlag = true;
                                  }

                       }else{
                          this.toastText= "原始密码不正确";
                          this.showFlag = true;
                      }
                }else{
                    this.toastText="新密码不一致";
                    this.showFlag = true;
                }



              
    }
  }
};
</script>


