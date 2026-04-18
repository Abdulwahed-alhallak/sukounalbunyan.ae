export function isMultiTierApprovalEnabled(
    settings?: { enable_multi_tier_approval?: string | null } | null
): boolean {
    return (settings?.enable_multi_tier_approval ?? 'on') === 'on';
}
