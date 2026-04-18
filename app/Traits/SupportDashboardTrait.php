<?php
namespace App\Traits;

use App\Models\HelpdeskTicket;
use Illuminate\Support\Facades\Schema;

trait SupportDashboardTrait
{
    private function getSupportKPIs(): ?array
    {
        $openTickets = HelpdeskTicket::where('created_by', $this->companyId)->where('status', 'open')->count();
        $totalTickets = HelpdeskTicket::where('created_by', $this->companyId)->count();

        $moduleTickets = 0;
        if ($this->moduleActive('SupportTicket') && class_exists(\Noble\SupportTicket\Models\Ticket::class) && Schema::hasTable('tickets')) {
            $moduleTickets = \Noble\SupportTicket\Models\Ticket::where('created_by', $this->companyId)->count();
        }

        if ($totalTickets === 0 && $moduleTickets === 0) return null;

        return [
            'open_tickets' => $openTickets,
            'total_tickets' => $totalTickets + $moduleTickets,
            'resolution_rate' => $totalTickets > 0 ? round((($totalTickets - $openTickets) / $totalTickets) * 100, 1) : 0,
        ];
    }
}
