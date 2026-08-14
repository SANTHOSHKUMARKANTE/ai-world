import { describe, expect, it } from 'vitest';

import { createAuditRecord, type RecordAuditInput } from '../src';

const AUDIT_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const ACTOR_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const RESOURCE_ID = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

const RECORDED_AT = new Date('2026-08-12T12:00:00.000Z');

function createInput(): RecordAuditInput {
  return {
    actorId: ACTOR_ID,
    action: 'identity.authorization.role-assignment.decision',
    resource: {
      type: 'identity.actor',
      id: RESOURCE_ID,
    },
    result: 'identity.authorization.allowed',
    context: {
      roleKey: 'administrator',
    },
  };
}

function createInputWithoutContext(): RecordAuditInput {
  return {
    actorId: ACTOR_ID,
    action: 'identity.authorization.role-assignment.decision',
    resource: {
      type: 'identity.actor',
      id: RESOURCE_ID,
    },
    result: 'identity.authorization.allowed',
  };
}

describe('createAuditRecord', () => {
  it('creates a canonical Audit Record', () => {
    const record = createAuditRecord(createInput(), AUDIT_ID, RECORDED_AT);

    expect(record).toEqual({
      id: AUDIT_ID,
      actorId: ACTOR_ID,
      action: 'identity.authorization.role-assignment.decision',
      resource: {
        type: 'identity.actor',
        id: RESOURCE_ID,
      },
      result: 'identity.authorization.allowed',
      context: {
        roleKey: 'administrator',
      },
      recordedAt: RECORDED_AT,
    });
  });

  it('does not require optional business context', () => {
    const record = createAuditRecord(createInputWithoutContext(), AUDIT_ID, RECORDED_AT);

    expect(record.context).toBeUndefined();
  });

  it('rejects a non-canonical Audit Record identifier', () => {
    expect(() => createAuditRecord(createInput(), 'not-a-resource-id', RECORDED_AT)).toThrow(
      TypeError,
    );
  });

  it('rejects a non-canonical Actor identifier', () => {
    expect(() =>
      createAuditRecord(
        {
          ...createInput(),
          actorId: 'not-an-actor-id',
        },
        AUDIT_ID,
        RECORDED_AT,
      ),
    ).toThrow(TypeError);
  });

  it('rejects a non-canonical action key', () => {
    expect(() =>
      createAuditRecord(
        {
          ...createInput(),
          action: 'RoleAssignment',
        },
        AUDIT_ID,
        RECORDED_AT,
      ),
    ).toThrow(TypeError);
  });

  it('rejects a non-canonical resource type key', () => {
    expect(() =>
      createAuditRecord(
        {
          ...createInput(),
          resource: {
            type: 'actor',
            id: RESOURCE_ID,
          },
        },
        AUDIT_ID,
        RECORDED_AT,
      ),
    ).toThrow(TypeError);
  });

  it('rejects a non-canonical resource identifier', () => {
    expect(() =>
      createAuditRecord(
        {
          ...createInput(),
          resource: {
            type: 'identity.actor',
            id: 'not-a-resource-id',
          },
        },
        AUDIT_ID,
        RECORDED_AT,
      ),
    ).toThrow(TypeError);
  });

  it('rejects a non-canonical result key', () => {
    expect(() =>
      createAuditRecord(
        {
          ...createInput(),
          result: 'allowed',
        },
        AUDIT_ID,
        RECORDED_AT,
      ),
    ).toThrow(TypeError);
  });

  it('rejects an invalid recordedAt value', () => {
    expect(() => createAuditRecord(createInput(), AUDIT_ID, new Date(Number.NaN))).toThrow(
      TypeError,
    );
  });

  it('rejects nested Audit context values', () => {
    const input = {
      ...createInput(),
      context: {
        nested: {
          value: true,
        },
      },
    } as unknown as RecordAuditInput;

    expect(() => createAuditRecord(input, AUDIT_ID, RECORDED_AT)).toThrow(TypeError);
  });

  it('rejects non-finite numeric Audit context values', () => {
    const input = {
      ...createInput(),
      context: {
        duration: Number.POSITIVE_INFINITY,
      },
    } as unknown as RecordAuditInput;

    expect(() => createAuditRecord(input, AUDIT_ID, RECORDED_AT)).toThrow(TypeError);
  });
});
