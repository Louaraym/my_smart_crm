<?php


namespace App\EventListener;


use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceNumberSubscriber implements EventSubscriberInterface
{
    private  $security;
    private $invoiceRepository;

    public function __construct(Security $security, InvoiceRepository $invoiceRepository)
    {
        $this->security = $security;
        $this->invoiceRepository = $invoiceRepository;
    }

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['setNumberForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setNumberForInvoice(ViewEvent $event): void
    {
        $value = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($value instanceof Invoice && $method === 'POST'){

            $user = $this->security->getUser();
            $nextInvoiceNumber = $this->invoiceRepository->setNextInvoiceNumber($user);

            $value->setInvoiceNumber($nextInvoiceNumber);

        }
    }


}