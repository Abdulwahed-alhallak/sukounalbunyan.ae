@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (config('mail.logo_url'))
<img src="{{ config('mail.logo_url') }}" class="logo" alt="Logo" style="height: 50px;">
@elseif (trim($slot) === 'Noble Architecture')
<img src="https://noble.dion.sy/assets/img/logo.png" class="logo" alt="Noble Architecture Logo">
@else
{!! $slot !!}
@endif
</a>
</td>
</tr>
