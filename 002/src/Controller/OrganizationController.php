<?php

namespace App\Controller;

use App\Entity\Organization;
use App\Form\OrganizationType;
use App\Repository\OrganizationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\MakerBundle\Validator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/organization')]
class OrganizationController extends AbstractController
{
    #[Route('/', name: 'app_organization_index', methods: ['GET'])]
    public function index(OrganizationRepository $organizationRepository): Response
    {
        return $this->json(['status' => 'success', 'organizations' => $organizationRepository->findAll()]);
    }

    #[Route('/new', name: 'app_organization_new', methods: ['GET', 'POST'])]
    public function new(Request $request, OrganizationRepository $organizationRepository, ValidatorInterface $validator): Response
    {
        $organization = new Organization();
        $data = json_decode($request->getContent(), true);

        $organization = $organization->setName($data['name'] ?? null);


        $errors = $validator->validate($organization);
        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return $this->json(['status' => 'error', 'message' => $errorsString]);
        }


        $organizationRepository->add($organization);

        return $this->json(['status' => 'success', 'organization' => $organization]);
    }

    #[Route('/{id}', name: 'app_organization_show', methods: ['GET'])]
    public function show(Organization $organization): Response
    {
        return $this->json($organization);
    }

    #[Route('/{id}/edit', name: 'app_organization_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Organization $organization, OrganizationRepository $organizationRepository, ValidatorInterface $validator): Response
    {
        $data = json_decode($request->getContent(), true);

        $organization = $organization->setName($data['name'] ?? null);

        $errors = $validator->validate($organization);
        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return $this->json(['status' => 'error', 'message' => $errorsString]);
        }

        $organizationRepository->add($organization);

        return $this->json(['status' => 'success', 'organization' => $organization]);
    }

    #[Route('/{id}', name: 'app_organization_delete', methods: ['POST'])]
    public function delete(Request $request, Organization $organization, OrganizationRepository $organizationRepository): Response
    {
        $organizationRepository->remove($organization);

        return $this->json(['status' => 'success']);
    }
}
