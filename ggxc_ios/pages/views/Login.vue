<template>
	<view class="content">
		<view class="hello-text">
			<text>hello,</text>
		</view>
		<view class="my-form">
			<form @submit="formSubmit" @reset="formReset">
				<view class="uni-form-item uni-column my-form-view">
					<label class="uni-list-cell uni-list-cell-pd">证件号码：</label>
					<input v-model.trim="formInfo.datas[0].uid" maxlength="19" class="uni-input my-input" name="uid" placeholder="请输入手机号或身份证号" />
				</view>
				<view class="uni-form-item uni-column my-form-view">
					<label class="uni-list-cell uni-list-cell-pd">登录密码：</label>
					<input v-model.trim="formInfo.datas[0].password" class="uni-input my-input" name="password" placeholder="请输入登录密码" password/>
				</view>
				<view class="uni-btn-v">
					<button form-type="submit">立即登录</button>
					<text>找回密码</text>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formInfo:{
					datas:[{
						uid:"",
						password:"",
						imei:"1",
						version:"1"
					}],
					vercode0: ""
				},
				//用户类型数据
				list: {},
				// 服务器返回的数据
				data:{},
				// 存储用户的信息
				userapp: {},
			}
		},
		onLoad() {

		},
		methods: {
			formSubmit: function(e) {
                const formdata = e.detail.value
				formdata.uid = formdata.uid.replace(/\s+/g,"");
				formdata.password = formdata.password.replace(/\s+/g,"");
				this.formInfo.datas[0].uid = formdata.uid
				this.formInfo.datas[0].password = formdata.password
				
				if (this.formInfo.datas[0].uid === "") {
				  uni.showToast({
				  	title: '请输入手机号或身份证号码',
				  	icon:'none'
				  })
				  return;
				} else if (this.formInfo.datas[0].password === "") {
				  uni.showToast({
				  	title: '请输入密码',
				  	icon:'none'
				  })
				  return;
				}
				
				console.log(this.formInfo)
				// 发起请求
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/AQYX1025",
					method:'post',
					data:JSON.stringify(this.formInfo),
					success: (res) => {
						console.log(res);
						let { data: { code, datas, msg } } = res;
						console.log(code);
						console.log(datas);
						console.log(msg);
						if(code!==200){
							uni.showToast({
								title: msg,
								icon:'none'
							})
							 return;
						}
						this.data = datas
						uni.setStorageSync('stast',this.data[0].userapps[0].appcode)
						uni.setStorageSync('appcode',this.data[0].userapps[0].appcode)
						uni.setStorageSync('uid',this.formInfo.datas[0].uid)
						uni.setStorageSync('password',this.formInfo.datas[0].password)
						//获取用户类型选择类型
						this.list = datas[0].userapps;
						this.loginHome(0)
						console.log(this.data);
					}
				})
            },
			// 进行登录跳转
			loginHome(index, id) {
			  //存储用户信息
			  this.userinfo(index);
			  // 登录成功
			  uni.showLoading({
				  title: '正在登录'
			  })
			  setTimeout(function () {
			      uni.hideLoading();
			  }, 500);
			  if (this.list[0].appcode === 1) {
			    uni.navigateTo({
			        url: '/pages/views/coachHome/coachHome'
			    });
			  } else if (this.list[0].appcode === 2) {
			    uni.navigateTo({
			        url: '/pages/views/coachHome/coachHome'
			    });
			  } else if (this.list[0].appcode === 3) {
			    uni.navigateTo({
			        url: '/pages/views/coachHome/coachHome'
			    });
			  }
			},
			//存储用户信息
			userinfo(index) {
			  this.userapp = [
			    {
			      //入校日期
			      applydate: this.data[0].applydate,
			      //邮箱
			      email: this.data[0].email,
			      //身份证号
			      icard: this.data[0].icard,
			      //用户id
			      id: this.data[0].id,
			      moreschool: this.data[0].moreschool,
			      //姓名
			      name: this.data[0].name,
			      //密码
			      password: this.formInfo.datas[0].password,
			      // 手机号
			      phone: this.data[0].phone,
			      //头像
			      photoPath: this.data[0].photoPath,
			      pwd: this.data[0].pwd,
			      //1男2女
			      sex: this.data[0].sex,
			      //驾证类型
			      traintype: this.traintype,
			      uid: this.formInfo.datas[0].uid,
			      //userapps角色
			      userapps: [this.data[0].userapps[index]],
			      //姓名
			      username: this.data[0].username,
			      //驾校名称
			      schoolname: this.data[0].userapps[0].schoolname,
			      //最后加ID
			      id: this.data[0].id
			    }
			  ];
			  let checkedIdStr = JSON.stringify(this.userapp);
			  uni.setStorageSync('datas',checkedIdStr)
			}
		}
	}
</script>

<style>
	.content {
		padding: 0 20upx;
	}
	.hello-text {
		text-align: center;
		color: #04bd9d;
		font-weight: bold;
		padding: 140upx 0 180upx;
		font-size: 170upx;
	}
	.my-form-view {
		display: flex;
		align-items: center;
		padding: 30upx;
		border-top: 1px solid #eee;
	}
	.my-form-view:nth-child(2){
		border-bottom: 1px solid #eee;
	}
	.my-form-view label {
		font-size: 30upx;
	}
	.my-form-view input {
		font-size: 30upx;
		flex: 1;
	}
	.uni-input-placeholder {
		color: #DDDFE6;
	}
	.uni-btn-v {
		text-align: center;
	}
	.uni-btn-v button{
		margin-top: 150upx;
		background-color: #04bd9d;
		color: #FFFFFF;
		border-radius: 50upx;
		font-size: 34upx;
		margin-bottom: 36upx;
		padding: 10upx 0;
	}
	.uni-btn-v text {
		font-size: 30upx;
		color: #3e3a39;
	}
</style>
