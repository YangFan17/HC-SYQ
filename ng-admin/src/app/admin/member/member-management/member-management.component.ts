import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { WechatUser } from '@shared/entity/wechat';
import { WechatUserServiceProxy, PagedResultDtoOfWeChatUser } from '@shared/service-proxies/wechat-service';
import { NzModalService } from 'ng-zorro-antd';
import { Parameter } from '@shared/service-proxies/entity';
import { AppConsts } from '@shared/AppConsts';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'member-management',
    templateUrl: 'member-management.component.html',
})
export class MemberManagementComponent extends AppComponentBase implements OnInit {
    search: any = { name: '', UserType: 6 };
    loading = false;
    exportLoading = false;
    weChatUsers: WechatUser[] = [];
    positions = [
        { text: '全部', value: 6 },
        { text: '零售客户', value: 1 },
        { text: '内部员工', value: 2 },
        { text: '消费者', value: 4 },
        { text: '取消关注', value: 5 },
    ];
    WechatUserName = '';
    constructor(injector: Injector, private wechatUserService: WechatUserServiceProxy, private modal: NzModalService, private router: Router) {
        super(injector);
    }
    ngOnInit(): void {
        this.refreshData();
    }
    refreshData(reset = false, search?: boolean) {
        if (reset) {
            this.query.pageIndex = 1;
            this.search = { name: '', UserType: 6 };
        }
        if (search) {
            this.query.pageIndex = 1;
        }
        this.loading = true;
        this.wechatUserService.getAll(this.query.skipCount(), this.query.pageSize, this.getParameter()).subscribe((result: PagedResultDtoOfWeChatUser) => {
            this.weChatUsers = result.items;
            this.loading = false;
            this.query.total = result.totalCount;
        });
    }
    getParameter(): Parameter[] {
        var arry = [];
        arry.push(Parameter.fromJS({ key: 'Name', value: this.search.name }));
        arry.push(Parameter.fromJS({ key: 'UserType', value: this.search.UserType === 6 ? null : this.search.UserType }));
        arry.push(Parameter.fromJS({ key: 'Code', value: this.search.code }));
        return arry;

    }

    /**
     * 解除绑定
     * @param wechatUser 微信用户实体
     */
    unBinding(wechatUser: WechatUser, TplContent) {
        this.WechatUserName = wechatUser.nickName;
        this.modal.confirm({
            content: TplContent,
            cancelText: '取消',
            okText: '确定',
            onOk: () => {
                // wechatUser.userType = 4;
                // wechatUser.bindStatus = 0;
                // wechatUser.userId=null;
                // wechatUser.userName=null;
                this.loading = true;
                this.wechatUserService.update(wechatUser).subscribe(() => {
                    this.notify.info(this.l('解除绑定成功！'));
                    this.refreshData();
                });
            }
        })
    }
    exportExcelAll() {
        this.exportLoading = true;
        this.wechatUserService.exportExcel({ name: this.search.name, userType: this.search.UserType === 6 ? null : this.search.UserType, code: this.search.code }).subscribe(result => {
            if (result.code == 0) {
                var url = AppConsts.remoteServiceBaseUrl + result.data;
                document.getElementById('aMemberExcelUrl').setAttribute('href', url);
                document.getElementById('btnMemberHref').click();
            } else {
                this.notify.error(result.msg);
            }
            this.exportLoading = false;
        });
    }

    editIntegral(openId: string) {
        this.router.navigate(['admin/member/integral-search-detail', openId])
    }
}
