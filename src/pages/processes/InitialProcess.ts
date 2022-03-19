import { Page } from 'puppeteer-core'
import { AppContextStoreKeys } from '../../context/AppContextStoreKeys';
import { Context } from '../../context/Context';
import { KeplrConfig } from '../../Keplr/KeplrConfig';
import { KeplrExtension } from '../KeplrExtension';
import { KeplrStake } from '../KeplrStake';
import { Processablepage } from '../ProcessablePage';

class InitialProcess {

    private page: Page;
    private ctx: Context;

    constructor(page: Page, ctx: Context) {
        this.page = page;
        this.ctx = ctx;
    }

    public async start(): Promise<boolean> {
        const keplrExtensionId = this.ctx.getObject<KeplrConfig>(AppContextStoreKeys.keplrConfig)!.getKeplrExtensionId();
        const processes: Processablepage[] = [new KeplrExtension(this.page, keplrExtensionId), new KeplrStake(this.page)]

        try {
            for (const prc of processes) {
                await prc.start();
            }
            return true;
        } catch (e) {
            return false;
        }
    }

}


export { InitialProcess }