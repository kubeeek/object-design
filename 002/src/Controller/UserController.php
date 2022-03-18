<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/user')]
class UserController extends AbstractController
{
    #[Route('/', name: 'app_user_index', methods: ['GET'])]
    public function index(UserRepository $userRepository): Response
    {
        return $this->json(['status' => 'success', 'users' => $userRepository->findAll()]);
    }

    #[Route('/new', name: 'app_user_new', methods: ['GET', 'POST'])]
    public function new(Request $request, UserRepository $userRepository, ValidatorInterface $validator): Response
    {
        $user = new User();
        $data = json_decode($request->getContent(), true);

        $user = $user->setName($data['name'] ?? null);
        $user = $user->setEmail($data['email'] ?? null);

        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return $this->json(['status' => 'error', 'message' => $errorsString]);
        }

        $userRepository->add($user);

        return $this->json(['status' => 'success', 'user' => $user]);
    }

    #[Route('/{id}', name: 'app_user_show', methods: ['GET'])]
    public function show(User $user): Response
    {
        return $this->json($user);
    }

    #[Route('/{id}/edit', name: 'app_user_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, User $user, UserRepository $userRepository, ValidatorInterface $validator): Response
    {
        $data = json_decode($request->getContent(), true);

        $user = $user->setName($data['name'] ?? null);
        $user = $user->setEmail($data['email'] ?? null);

        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return $this->json(['status' => 'error', 'message' => $errorsString]);
        }

        $userRepository->add($user);

        return $this->json(['status' => 'success', 'user' => $user]);
    }

    #[Route('/{id}', name: 'app_user_delete', methods: ['POST'])]
    public function delete(Request $request, User $user, UserRepository $userRepository): Response
    {
        $userRepository->remove($user);

        return $this->json(['status' => 'success']);
    }
}
