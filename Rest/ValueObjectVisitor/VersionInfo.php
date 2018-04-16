<?php

/**
 * @copyright Copyright (C) eZ Systems AS. All rights reserved.
 * @license For full copyright and license information view LICENSE file distributed with this source code.
 */
namespace EzSystems\PlatformUIBundle\Rest\ValueObjectVisitor;

use eZ\Publish\API\Repository\Repository;
use eZ\Publish\Core\REST\Common\Output\Generator;
use eZ\Publish\Core\REST\Common\Output\Visitor;
use eZ\Publish\Core\REST\Server\Values\VersionTranslationInfo as VersionTranslationInfoValue;
use eZ\Publish\Core\REST\Server\Output\ValueObjectVisitor\VersionInfo as BaseVersionInfo;

/**
 * VersionInfo value object visitor.
 */
class VersionInfo extends BaseVersionInfo
{
    /** @var \eZ\Publish\API\Repository\Repository */
    private $repository;

    /**
     * VersionInfo constructor.
     *
     * @param \eZ\Publish\API\Repository\Repository $repository
     */
    public function __construct(Repository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Visit struct returned by controllers.
     *
     * @param \eZ\Publish\Core\REST\Common\Output\Visitor $visitor
     * @param \eZ\Publish\Core\REST\Common\Output\Generator $generator
     * @param \eZ\Publish\API\Repository\Values\Content\VersionInfo $data
     */
    public function visit(Visitor $visitor, Generator $generator, $data)
    {
        $versionInfo = $data;

        $generator->startHashElement('VersionInfo');

        $generator->startValueElement('id', $versionInfo->id);
        $generator->endValueElement('id');

        $generator->startValueElement('versionNo', $versionInfo->versionNo);
        $generator->endValueElement('versionNo');

        $generator->startValueElement(
            'status',
            $this->getStatusString($versionInfo->status)
        );
        $generator->endValueElement('status');

        $generator->startValueElement(
            'modificationDate',
            $versionInfo->modificationDate->format('c')
        );
        $generator->endValueElement('modificationDate');

        $generator->startObjectElement('Creator', 'User');
        $generator->startAttribute(
            'href',
            $this->router->generate('ezpublish_rest_loadUser',
                array('userId' => $versionInfo->creatorId))
        );
        $generator->endAttribute('href');
        $generator->endObjectElement('Creator');

        /** @var \eZ\Publish\API\Repository\Values\User\User $user */
        $user = $this->repository->sudo(function(Repository $repository) use($versionInfo) {
            return $repository->getUserService()->loadUser($versionInfo->creatorId);
        });

        $generator->startValueElement('creatorName', $user->getName());
        $generator->endValueElement('creatorName');

        $generator->startValueElement(
            'creationDate',
            $versionInfo->creationDate->format('c')
        );
        $generator->endValueElement('creationDate');

        $generator->startValueElement(
            'initialLanguageCode',
            $versionInfo->initialLanguageCode
        );
        $generator->endValueElement('initialLanguageCode');

        $generator->startValueElement(
            'languageCodes',
            implode(',', $versionInfo->languageCodes)
        );
        $generator->endValueElement('languageCodes');

        $visitor->visitValueObject(new VersionTranslationInfoValue($versionInfo));

        $this->visitNamesList($generator, $versionInfo->names);

        $generator->startObjectElement('Content', 'ContentInfo');
        $generator->startAttribute(
            'href',
            $this->router->generate('ezpublish_rest_loadContent', array('contentId' => $versionInfo->getContentInfo()->id))
        );
        $generator->endAttribute('href');
        $generator->endObjectElement('Content');

        $generator->endHashElement('VersionInfo');
    }
}
