<?php

namespace Noble\Telegram\Listeners;

use Noble\Feedback\Events\CreateTemplate;
use Noble\Feedback\Models\TemplateModule;
use Noble\Telegram\Services\SendMsg;

class CreateTemplateLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateTemplate $event)
    {
        $templates = $event->template;
        $module    = TemplateModule::find($templates->module);
        if (company_setting('Telegram New Template')  == 'on') {
            if(!empty($module))
            {
                $uArr = [
                    'submodule_name' => $module->submodule,
                    'module_name'    => $module->module,
                ];
            }

            SendMsg::SendMsgs($uArr , 'New Template');
        }
    }
}
