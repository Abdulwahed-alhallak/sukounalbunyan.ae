<?php
\App\Models\User::where('email', 'superadmin@example.com')->update(['email' => 'superadmin@dion.sy']);
echo "DB Updated successfully.\n";
