<?php

namespace App\Services;

use App\Models\DionAuditLog;
use Illuminate\Support\Facades\Request;

class ZeroTrustAuditService
{
    /**
     * Log an action directly into the Zero-Trust Audit Log
     */
    public static function log($action, $entityType = null, $entityId = null, $oldPayload = null, $newPayload = null, $riskLevel = 'LOW')
    {
        try {
            $user = auth()->user();
            
            DionAuditLog::create([
                'company_id'   => $user ? creatorId() : null,
                'user_id'      => $user ? $user->id : null,
                'action'       => $action,
                'entity_type'  => $entityType,
                'entity_id'    => $entityId,
                'old_payload'  => $oldPayload,
                'new_payload'  => $newPayload,
                'ip_address'   => Request::ip(),
                'user_agent'   => substr(Request::userAgent() ?? '', 0, 255),
                'geo_location' => null, // Can integrate GeoIP later if needed
                'risk_level'   => $riskLevel,
            ]);
        } catch (\Exception $e) {
            // Failsafe: Do not break the request if the audit log fails
            \Illuminate\Support\Facades\Log::error('Zero-Trust Audit Log Failed: ' . $e->getMessage());
        }
    }
}
