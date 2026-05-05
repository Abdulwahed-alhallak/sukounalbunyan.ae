<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Symfony\Component\Finder\Finder;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$paths = [
    __DIR__.'/app/Models',
    __DIR__.'/packages/noble'
];

$finder = new Finder();
$finder->files()->in($paths)->name('*.php')->path('Models');

$brokenRelations = [];

foreach ($finder as $file) {
    $content = file_get_contents($file->getRealPath());
    if (preg_match('/namespace\s+(.+?);/', $content, $matchNamespace)) {
        if (preg_match('/class\s+(\w+)\s+extends/', $content, $matchClass)) {
            $className = $matchNamespace[1] . '\\' . $matchClass[1];
            
            if (class_exists($className) && is_subclass_of($className, Model::class)) {
                try {
                    $reflection = new ReflectionClass($className);
                    foreach ($reflection->getMethods() as $method) {
                        if ($method->class !== $className) continue;
                        if ($method->getNumberOfParameters() > 0) continue;
                        
                        $returnType = $method->getReturnType();
                        $isRelation = false;
                        if ($returnType && !$returnType->isBuiltin()) {
                            $typeName = $returnType->getName();
                            if (is_subclass_of($typeName, Relation::class) || strpos($typeName, 'Relations') !== false) {
                                $isRelation = true;
                            }
                        } else {
                            // Heuristic: check if method code calls belongsTo, hasMany, etc.
                            $code = file_get_contents($method->getFileName());
                            $start = $method->getStartLine() - 1;
                            $length = $method->getEndLine() - $start;
                            $methodCode = implode("", array_slice(file($method->getFileName()), $start, $length));
                            
                            if (preg_match('/return\s+\$this->(belongsTo|hasMany|hasOne|belongsToMany|morphTo|morphMany|morphOne)\(/', $methodCode)) {
                                $isRelation = true;
                            }
                        }

                        if ($isRelation) {
                            try {
                                $modelInstance = $reflection->newInstanceWithoutConstructor();
                                $relation = $method->invoke($modelInstance);
                                
                                if ($relation instanceof Relation) {
                                    $relatedClass = get_class($relation->getRelated());
                                    if (!class_exists($relatedClass)) {
                                        $brokenRelations[] = [
                                            'class' => $className,
                                            'method' => $method->getName(),
                                            'target' => $relatedClass,
                                            'error' => 'Target class does not exist'
                                        ];
                                    }
                                }
                            } catch (\Throwable $e) {
                                $errStr = $e->getMessage();
                                if (strpos($errStr, 'not found') !== false || strpos($errStr, 'does not exist') !== false) {
                                    $brokenRelations[] = [
                                        'class' => $className,
                                        'method' => $method->getName(),
                                        'error' => $errStr
                                    ];
                                }
                            }
                        }
                    }
                } catch (\Throwable $e) {
                    // Skip
                }
            }
        }
    }
}

if (empty($brokenRelations)) {
    echo "AUDIT PASSED: No broken relationships found.\n";
} else {
    echo "AUDIT FAILED: Found broken relationships:\n";
    foreach ($brokenRelations as $b) {
        echo "- Class {$b['class']} -> method {$b['method']}: {$b['error']}\n";
        if (isset($b['target'])) echo "  Target: {$b['target']}\n";
    }
}
