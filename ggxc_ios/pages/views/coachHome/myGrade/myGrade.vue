<template>
	<view class="box">
		<!-- 教练信息 -->
		<view class="header-info">
			<view class="header-one">
				<view>
					<image src="../../../../static/images/01_17.png"></image>
					<image src="../../../../static/images/01_17.png"></image>
					<image src="../../../../static/images/01_17.png"></image>
					<image src="../../../../static/images/01_17.png"></image>
					<image src="../../../../static/images/01_17.png"></image>
					<text>5分</text>
				</view>
				<view>
					2018-07-08
				</view>
			</view>
			<view class="header-two">
				<view>
					<image src="../../../../static/images/6_03.png"></image>
				</view>
				<view class="header-two-right">
					<view>
						<text>321</text>
						<text>312</text>
					</view>
					<view>123548978978</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		}
	}
</script>

<style>
	page{
		background-color: #F8F8F8;
	}
	.box {
		padding: 30upx 30upx 0;
	}
	/* 信息区域 */
	.header-info {
		padding: 30upx;
		border-radius: 20upx;
		background-color: #FFFFFF;
		height: 300upx;
	}
	.header-one {
		display: flex;
		justify-content: space-between;
		padding-bottom: 16upx;
	}
	.header-one view:nth-child(1){
		display: flex;
	}
	.header-one view:nth-child(1) image {
		width: 40upx;
		height: 34upx;
		display: block;
		margin-right: 6upx;
	}
	.header-one view:nth-child(1) text {
		font-size: 24upx;
		color: #a1a1a1;
	}
	.header-one view:nth-child(2) {
		color: rgba(0,0,0,.87);
		font-size: 24upx;
	}
	.header-two {
		display: flex;
		align-items: center;
	}
	.header-two view:nth-child(1) image{
		width: 130upx;
		height: 130upx;
	}
	.header-two .header-two-right view:nth-child(1) {
		
	}
</style>
