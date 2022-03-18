<?php

namespace App\Controller;

use App\Entity\Post;
use App\Repository\PostRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/post')]
class PostController extends AbstractController
{
    #[Route('/', name: 'app_post_index', methods: ['GET'])]
    public function index(PostRepository $postRepository): Response
    {
        return $this->json(['status' => 'success', 'posts' => $postRepository->findAll()]);
    }

    #[Route('/new', name: 'app_post_new', methods: ['GET', 'POST'])]
    public function new(Request $request, PostRepository $postRepository, ValidatorInterface $validator): Response
    {
        $post = new Post();
        $data = json_decode($request->getContent(), true);

        $post = $post->setBody($data['body'] ?? null);
        $post = $post->setUser($data['user'] ?? null);


        $errors = $validator->validate($post);
        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return $this->json(['status' => 'error', 'message' => $errorsString]);
        }


        $postRepository->add($post);

        return $this->json(['status' => 'success', 'post' => $post]);
    }

    #[Route('/{id}', name: 'app_post_show', methods: ['GET'])]
    public function show(Post $post): Response
    {
        return $this->json($post);
    }

    #[Route('/{id}/edit', name: 'app_post_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Post $post, PostRepository $postRepository, ValidatorInterface $validator): Response
    {
        $data = json_decode($request->getContent(), true);

        $post = $post->setBody($data['body'] ?? null);

        $errors = $validator->validate($post);
        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return $this->json(['status' => 'error', 'message' => $errorsString]);
        }

        $postRepository->add($post);

        return $this->json(['status' => 'success', 'post' => $post]);
    }

    #[Route('/{id}', name: 'app_post_delete', methods: ['POST'])]
    public function delete(Request $request, Post $post, PostRepository $postRepository): Response
    {
        $postRepository->remove($post);

        return $this->json(['status' => 'success']);
    }
}
