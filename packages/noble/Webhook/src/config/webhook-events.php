<?php

return [
    'events' => [
        'App\Events\CreateUser' => [
            [
                'action' => 'New User',
                'module' => 'general',
                'type' => 'super admin',
                'extractor' => 'Noble\Webhook\Extractors\UserDataExtractor'
            ],
            [
                'action' => 'New User',
                'module' => 'general',
                'type' => 'company',
                'extractor' => 'Noble\Webhook\Extractors\UserDataExtractor'
            ]
        ],

        // event use pending
        // 'App\Events\CreateSubscriber' => [
        //     'action' => 'New Subscriber',
        //     'module' => 'general',
        //     'type' => 'super admin',
        //     'extractor' => 'Noble\Webhook\Extractors\SubscriberDataExtractor'
        // ],

        'App\Events\CreateSalesInvoice' => [
            'action' => 'New Sales Invoice',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\SalesInvoiceDataExtractor'
        ],
        'App\Events\PostSalesInvoice' => [
            'action' => 'Sales Invoice Status Updated',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\PostSalesInvoiceDataExtractor'
        ],
        'App\Events\CreateSalesProposal' => [
            'action' => 'New Sales Proposal',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\SalesProposalDataExtractor'
        ],
        'App\Events\AcceptSalesProposal' => [
            'action' => 'Sales Proposal Status Updated',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\AcceptSalesProposalDataExtractor'
        ],
        'App\Events\CreatePurchaseInvoice' => [
            'action' => 'New Purchase Invoice',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\PurchaseInvoiceDataExtractor'
        ],
        'App\Events\CreateWarehouse' => [
            'action' => 'New Warehouse',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\WarehouseDataExtractor'
        ],
        // Add other package wise event and data in this only, and create "Extractors" proper no need to do anything else

        'Noble\Account\Events\CreateCustomer' => [
            'action' => 'New Customer',
            'module' => 'Account',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\CustomerDataExtractor'
        ],
        'Noble\Account\Events\CreateVendor' => [
            'action' => 'New Vendor',
            'module' => 'Account',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\VendorDataExtractor'
        ],
        'Noble\Account\Events\CreateRevenue' => [
            'action' => 'New Revenue',
            'module' => 'Account',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\RevenueDataExtractor'
        ],
        'Noble\Recruitment\Events\CreateJobPosting' => [
            'action' => 'New Job Posting',
            'module' => 'Recruitment',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\JobPostingDataExtractor'
        ],
        'Noble\Recruitment\Events\CreateCandidate' => [
            'action' => 'New Job Candidate',
            'module' => 'Recruitment',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\JobCandidateDataExtractor'
        ],
        'Noble\Recruitment\Events\CreateInterview' => [
            'action' => 'New Job Interview Schedule',
            'module' => 'Recruitment',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\JobInterviewScheduleDataExtractor'
        ],
        'Noble\Recruitment\Events\ConvertOfferToEmployee' => [
            'action' => 'New Convert To Employee',
            'module' => 'Recruitment',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\ConvertToEmployeeDataExtractor'
        ],
        'Noble\Training\Events\CreateTraining' => [
            'action' => 'New Training',
            'module' => 'Training',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\TrainingDataExtractor'
        ],
        'Noble\Training\Events\CreateTrainer' => [
            'action' => 'New Trainer',
            'module' => 'Training',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\TrainerDataExtractor'
        ],
        'Noble\ZoomMeeting\Events\CreateZoomMeeting' => [
            'action' => 'New Zoom Meeting',
            'module' => 'ZoomMeeting',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\ZoomMeetingDataExtractor'
        ],
        'Noble\Taskly\Events\CreateProject' => [
            'action' => 'New Project',
            'module' => 'Taskly',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\ProjectDataExtractor'
        ],
        'Noble\Taskly\Events\CreateProjectMilestone' => [
            'action' => 'New Milestone',
            'module' => 'Taskly',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\MilestoneDataExtractor'
        ],
        'Noble\Taskly\Events\CreateProjectTask' => [
            'action' => 'New Task',
            'module' => 'Taskly',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\TaskDataExtractor'
        ],
        'Noble\Taskly\Events\UpdateTaskStage' => [
            'action' => 'Task Stage Update',
            'module' => 'Taskly',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\TaskStageUpdateDataExtractor'
        ],
        'Noble\Taskly\Events\CreateTaskComment' => [
            'action' => 'New Task Comment',
            'module' => 'Taskly',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\TaskCommentDataExtractor'
        ],
        'Noble\Taskly\Events\CreateProjectBug' => [
            'action' => 'New Bug',
            'module' => 'Taskly',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\BugDataExtractor'
        ],
        'Noble\Lead\Events\CreateLead' => [
            'action' => 'New Lead',
            'module' => 'Lead',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\LeadDataExtractor'
        ],
        'Noble\Lead\Events\CreateDeal' => [
            'action' => 'New Deal',
            'module' => 'Lead',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\DealDataExtractor'
        ],
        'Noble\Lead\Events\LeadMoved' => [
            'action' => 'Lead Moved',
            'module' => 'Lead',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\LeadMovedDataExtractor'
        ],
        'Noble\Lead\Events\DealMoved' => [
            'action' => 'Deal Moved',
            'module' => 'Lead',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\DealMovedDataExtractor'
        ],
        'Noble\Lead\Events\LeadConvertDeal' => [
            'action' => 'Convert To Deal',
            'module' => 'Lead',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\ConvertToDealDataExtractor'
        ],
        'Noble\Contract\Events\CreateContract' => [
            'action' => 'New Contract',
            'module' => 'Contract',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\ContractDataExtractor'
        ],
        'Noble\Hrm\Events\CreateAward' => [
            'action' => 'New Award',
            'module' => 'Hrm',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\HrmAwardDataExtractor'
        ],
        'Noble\Hrm\Events\CreateAnnouncement' => [
            'action' => 'New Announcement',
            'module' => 'Hrm',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\HrmAnnouncementDataExtractor'
        ],
        'Noble\Hrm\Events\CreateHoliday' => [
            'action' => 'New Holidays',
            'module' => 'Hrm',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\HrmHolidayDataExtractor'
        ],
        'Noble\Hrm\Events\CreateEvent' => [
            'action' => 'New Event',
            'module' => 'Hrm',
            'type' => 'company',
            'extractor' => 'Noble\Webhook\Extractors\HrmEventDataExtractor'
        ],
    ]
];
