import { describeNoteRepositoryContract } from './contract';
import { createFakeNoteRepository } from './fake';

describeNoteRepositoryContract('fake', () => createFakeNoteRepository());
