<?php

namespace EzSystems\PlatformUIBundle\ApplicationConfig\Providers;

use EzSystems\PlatformUIBundle\ApplicationConfig\Provider;

class ImageVariationsProvider implements Provider
{
    /** @var array */
    private $variations;

    public function __construct(array $variations)
    {
        $this->variations = [];
        foreach ($variations as $name => $variation) {
            if (!isset($variation['internal']) || !$variation['internal']) {
                $this->variations[$name] = $variation;
            }
        }
    }

    public function getConfig()
    {
        return $this->variations;
    }
}
