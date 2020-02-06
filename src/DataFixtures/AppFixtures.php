<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        for ($u =0; $u < 15; $u++){

            $user = new User();
            $invoiceNumber = 1;
            $hash = $this->encoder->encodePassword($user, 'password');

            $user->setFirstName($faker->firstName())
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($hash);

            $manager->persist($user);

            for ($c =0, $cMax = random_int(5, 15); $c<$cMax; $c++){

                $customer = new Customer();

                $customer->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName)
                    ->setEmail($faker->email)
                    ->setCompany($faker->company)
                    ->setUSer($user);

                $manager->persist($customer);

                for ($i = 0, $iMax = random_int(3, 10); $i < $iMax; $i++){

                    $invoice = new  Invoice();

                    $invoice->setAmount($faker->randomFloat(2, 250, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT','PAID','CANCELLED']))
                        ->setInvoiceNumber($invoiceNumber)
                        ->setCustomer($customer);

                    $invoiceNumber++;

                    $manager->persist($invoice);
                }
            }
        }

        $manager->flush();
    }
}
