<?php
\App\Models\User::where('email', 'superadmin@noble.dion.sy')->update(['email' => 'superadmin@dion.sy']);
echo "DB Updated successfully.\n";
