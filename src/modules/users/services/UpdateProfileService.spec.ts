import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from './UpdateProfileService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;

let updateProfile: UpdateProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await updateProfile.execute({
      user_id: user.id,
      name: 'Alan Cintra',
      email: 'alancintra77@gmail.com',
    });

    expect(user.name).toBe('Alan Cintra');
    expect(user.email).toBe('alancintra77@gmail.com');
  });

  it('should not be able to update user email to an already used one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await fakeUsersRepository.create({
      name: 'Alan Cintra',
      email: 'alancintra7@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'alancintra7@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      old_password: '123456',
      password: '181092508',
    });

    expect(user.password).toBe('181092508');
  });

  it('should not be able to update non-existent user profile', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existent-user-id',
        name: 'John Doe',
        email: 'john.doe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update current password without informing the old one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '181092508',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user password when informing wrong old onde', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'john.doe@example.com',
        old_password: 'wrong-old-password',
        password: '181092508',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
