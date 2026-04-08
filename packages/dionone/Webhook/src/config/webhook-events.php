<?php

return [
    'events' => [
        'App\Events\CreateUser' => [
            [
                'action' => 'New User',
                'module' => 'general',
                'type' => 'super admin',
                'extractor' => 'DionONE\Webhook\Extractors\UserDataExtractor'
            ],
            [
                'action' => 'New User',
                'module' => 'general',
                'type' => 'company',
                'extractor' => 'DionONE\Webhook\Extractors\UserDataExtractor'
            ]
        ],

        // event use pending
        // 'App\Events\CreateSubscriber' => [
        //     'action' => 'New Subscriber',
        //     'module' => 'general',
        //     'type' => 'super admin',
        //     'extractor' => 'DionONE\Webhook\Extractors\SubscriberDataExtractor'
        // ],

        'App\Events\CreateSalesInvoice' => [
            'action' => 'New Sales Invoice',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\SalesInvoiceDataExtractor'
        ],
        'App\Events\PostSalesInvoice' => [
            'action' => 'Sales Invoice Status Updated',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\PostSalesInvoiceDataExtractor'
        ],
        'App\Events\CreateSalesProposal' => [
            'action' => 'New Sales Proposal',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\SalesProposalDataExtractor'
        ],
        'App\Events\AcceptSalesProposal' => [
            'action' => 'Sales Proposal Status Updated',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\AcceptSalesProposalDataExtractor'
        ],
        'App\Events\CreatePurchaseInvoice' => [
            'action' => 'New Purchase Invoice',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\PurchaseInvoiceDataExtractor'
        ],
        'App\Events\CreateWarehouse' => [
            'action' => 'New Warehouse',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\WarehouseDataExtractor'
        ],
        // Add other package wise event and data in this only, and create "Extractors" proper no need to do anything else

        'DionONE\Account\Events\CreateCustomer' => [
            'action' => 'New Customer',
            'module' => 'Account',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\CustomerDataExtractor'
        ],
        'DionONE\Account\Events\CreateVendor' => [
            'action' => 'New Vendor',
            'module' => 'Account',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\VendorDataExtractor'
        ],
        'DionONE\Account\Events\CreateRevenue' => [
            'action' => 'New Revenue',
            'module' => 'Account',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\RevenueDataExtractor'
        ],
        'DionONE\Recruitment\Events\CreateJobPosting' => [
            'action' => 'New Job Posting',
            'module' => 'Recruitment',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\JobPostingDataExtractor'
        ],
        'DionONE\Recruitment\Events\CreateCandidate' => [
            'action' => 'New Job Candidate',
            'module' => 'Recruitment',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\JobCandidateDataExtractor'
        ],
        'DionONE\Recruitment\Events\CreateInterview' => [
            'action' => 'New Job Interview Schedule',
            'module' => 'Recruitment',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\JobInterviewScheduleDataExtractor'
        ],
        'DionONE\Recruitment\Events\ConvertOfferToEmployee' => [
            'action' => 'New Convert To Employee',
            'module' => 'Recruitment',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\ConvertToEmployeeDataExtractor'
        ],
        'DionONE\Training\Events\CreateTraining' => [
            'action' => 'New Training',
            'module' => 'Training',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\TrainingDataExtractor'
        ],
        'DionONE\Training\Events\CreateTrainer' => [
            'action' => 'New Trainer',
            'module' => 'Training',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\TrainerDataExtractor'
        ],
        'DionONE\ZoomMeeting\Events\CreateZoomMeeting' => [
            'action' => 'New Zoom Meeting',
            'module' => 'ZoomMeeting',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\ZoomMeetingDataExtractor'
        ],
        'DionONE\Taskly\Events\CreateProject' => [
            'action' => 'New Project',
            'module' => 'Taskly',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\ProjectDataExtractor'
        ],
        'DionONE\Taskly\Events\CreateProjectMilestone' => [
            'action' => 'New Milestone',
            'module' => 'Taskly',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\MilestoneDataExtractor'
        ],
        'DionONE\Taskly\Events\CreateProjectTask' => [
            'action' => 'New Task',
            'module' => 'Taskly',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\TaskDataExtractor'
        ],
        'DionONE\Taskly\Events\UpdateTaskStage' => [
            'action' => 'Task Stage Update',
            'module' => 'Taskly',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\TaskStageUpdateDataExtractor'
        ],
        'DionONE\Taskly\Events\CreateTaskComment' => [
            'action' => 'New Task Comment',
            'module' => 'Taskly',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\TaskCommentDataExtractor'
        ],
        'DionONE\Taskly\Events\CreateProjectBug' => [
            'action' => 'New Bug',
            'module' => 'Taskly',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\BugDataExtractor'
        ],
        'DionONE\Lead\Events\CreateLead' => [
            'action' => 'New Lead',
            'module' => 'Lead',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\LeadDataExtractor'
        ],
        'DionONE\Lead\Events\CreateDeal' => [
            'action' => 'New Deal',
            'module' => 'Lead',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\DealDataExtractor'
        ],
        'DionONE\Lead\Events\LeadMoved' => [
            'action' => 'Lead Moved',
            'module' => 'Lead',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\LeadMovedDataExtractor'
        ],
        'DionONE\Lead\Events\DealMoved' => [
            'action' => 'Deal Moved',
            'module' => 'Lead',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\DealMovedDataExtractor'
        ],
        'DionONE\Lead\Events\LeadConvertDeal' => [
            'action' => 'Convert To Deal',
            'module' => 'Lead',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\ConvertToDealDataExtractor'
        ],
        'DionONE\Contract\Events\CreateContract' => [
            'action' => 'New Contract',
            'module' => 'Contract',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\ContractDataExtractor'
        ],
        'DionONE\Hrm\Events\CreateAward' => [
            'action' => 'New Award',
            'module' => 'Hrm',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\HrmAwardDataExtractor'
        ],
        'DionONE\Hrm\Events\CreateAnnouncement' => [
            'action' => 'New Announcement',
            'module' => 'Hrm',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\HrmAnnouncementDataExtractor'
        ],
        'DionONE\Hrm\Events\CreateHoliday' => [
            'action' => 'New Holidays',
            'module' => 'Hrm',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\HrmHolidayDataExtractor'
        ],
        'DionONE\Hrm\Events\CreateEvent' => [
            'action' => 'New Event',
            'module' => 'Hrm',
            'type' => 'company',
            'extractor' => 'DionONE\Webhook\Extractors\HrmEventDataExtractor'
        ],
    ]
];
